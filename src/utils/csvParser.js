// const fs = require("fs");
// const csv = require("csv-parser");
// const Fixture = require("../models/Fixture");

// function parseAndSaveCSV(filePath) {
//   return new Promise((resolve, reject) => {
//     const records = [];
//     fs.createReadStream(filePath)
//       .pipe(csv())
//       .on("data", (data) => records.push(data))
//       .on("end", async () => {
//         try {
//           await Fixture.insertMany(records);
//           resolve();
//         } catch (e) {
//           reject(e);
//         }
//       })
//       .on("error", (err) => reject(err));
//   });
// }

// module.exports = parseAndSaveCSV;
// src/utils/parseAndSaveCSV.js
const fs = require("fs");
// const path = require("path");
const csv = require("csv-parser");
const Fixture = require("../models/Fixture");

function parseAndSaveCSV(filePath) {
  return new Promise((resolve, reject) => {
    const rows = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => rows.push(row))
      .on("end", async () => {
        const requiredFields = [
          "fixture_mid",
          "season",
          "competition_name",
          "fixture_datetime",
          "fixture_round",
          "home_team",
          "away_team",
        ];

        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          for (const fld of requiredFields) {
            if (!row[fld] || row[fld].toString().trim() === "") {
              console.log("row", row, fld, i);

              cleanup();
              return reject(
                new Error(`Row ${i + 1} : Missing params "${fld}"`)
              );
            }
          }

          if (isNaN(Date.parse(row.fixture_datetime))) {
            cleanup();
            return reject(
              new Error(`Row ${i + 1} :Date format "${row.fixture_datetime}"`)
            );
          }
        }

        try {
          const allMids = rows.map((r) => r.fixture_mid.toString());
          const uniqueFileMids = [...new Set(allMids)];

          const existing = await Fixture.find(
            { fixture_mid: { $in: uniqueFileMids } },
            { fixture_mid: 1, _id: 0 }
          ).lean();

          const existingSet = new Set(
            existing.map((doc) => doc.fixture_mid.toString())
          );

          const toInsert = rows.filter(
            (r) => !existingSet.has(r.fixture_mid.toString())
          );

          let insertedCount = 0;
          if (toInsert.length > 0) {
            const result = await Fixture.insertMany(toInsert);
            insertedCount = result.length;
          }

          cleanup();
          return resolve({
            insertedCount,
            skippedCount: rows.length - toInsert.length,
          });
        } catch (err) {
          cleanup();
          return reject(err);
        }
      })
      .on("error", (err) => {
        cleanup();
        return reject(new Error(`parsing failed ${err.message}`));
      });

    function cleanup() {
      fs.unlink(filePath, (e) => {
        if (e) console.warn("failed to delete temp file", filePath, e);
      });
    }
  });
}

module.exports = parseAndSaveCSV;
