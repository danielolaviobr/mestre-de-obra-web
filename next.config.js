const withPWA = require("next-pwa");

module.exports = withPWA({
  pwa: {
    dest: "public",
    disable: process.env.ENV === "development",
    register: true,
    scope: "/app",
    sw: "sw.js",
  },
});
