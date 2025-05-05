const { Schema, model } = require("mongoose");

const FixtureSchema = new Schema(
  {
    fixture_mid: { type: String, required: true },
    season: { type: String, required: true },
    competition_name: { type: String, required: true },
    fixture_datetime: { type: String, required: true },
    fixture_round: { type: String, required: true },
    home_team: { type: String, required: true },
    away_team: { type: String, required: true },
  },
  { collection: "fixtures", timestamps: true }
);

module.exports = model("Fixture", FixtureSchema);
