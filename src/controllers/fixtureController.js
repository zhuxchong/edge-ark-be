const Fixture = require("../models/Fixture");

exports.searchFixtures = async (req, res) => {
  const q = req.query.q || "";
  try {
    const regex = new RegExp(q, "i");
    const results = await Fixture.find({
      $or: [{ home_team: regex }, { away_team: regex }],
    })
      .limit(100) //pagination???
      .lean();
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Search failed" });
  }
};
