const fs = require("fs");
const csv = require("csv-parser");
const Fixture = require("../models/Fixture");

function parseAndSaveCSV(filePath) {
  return new Promise((resolve, reject) => {
    const records = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => records.push(data))
      .on("end", async () => {
        try {
          await Fixture.insertMany(records);
          resolve();
        } catch (e) {
          reject(e);
        }
      })
      .on("error", (err) => reject(err));
  });
}

module.exports = parseAndSaveCSV;
