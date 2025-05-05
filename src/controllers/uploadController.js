const parseAndSaveCSV = require("../utils/csvParser");

exports.uploadCSV = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file provided" });
  try {
    await parseAndSaveCSV(req.file.path);
    res.json({ success: true });
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({
      error: err.message || "CSV import failed",
      errCode: err.errorCode,
    });
  }
};
