module.exports = {
  apps: [
    {
      name: "server",
      script: "./server.js",
      env: require("dotenv").config().parsed
    }
  ]
};
