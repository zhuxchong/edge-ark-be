const parseAndSaveCSV = require("../utils/csvParser");

exports.uploadCSV = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file provided" });
  try {
    await parseAndSaveCSV(req.file.path);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "CSV import failed" });
  }
};
