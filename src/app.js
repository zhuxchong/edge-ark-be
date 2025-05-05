const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const xssClean = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");
const path = require("path");
const connectDB = require("./db/index");
const uploadRoutes = require("./routes/uploadRoutes");
const fixtureRoutes = require("./routes/fixtureRoutes");
require("dotenv").config();

const app = express();
console.log("process.env", process.env);
const PORT = process.env.PORT;

app.use(helmet());
app.use(cors());
app.use(xssClean());
app.use(mongoSanitize());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(express.json());

app.use("/api/upload", uploadRoutes);
app.use("/api/fixtures", fixtureRoutes);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

connectDB().then(() => {
  app.listen(PORT, () => console.log(`running at http://localhost:${PORT}`));
});
