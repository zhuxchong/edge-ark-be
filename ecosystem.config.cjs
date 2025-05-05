module.exports = {
  apps: [
    {
      name: "edge-ark",
      script: "src/app.js",
      instances: 1,
      exec_mode: "fork",
      watch: true,
      env: {
        NODE_ENV: "production",
        PORT: process.env.PORT,
        MONGO_URI: process.env.MONGO_URI,
      },
    },
  ],
};
