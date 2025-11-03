const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    ["/api", "/backOfficeApi"],
    createProxyMiddleware({
      target: "https://100.123.134.37:7293",
      changeOrigin: true,
      secure: false,
    })
  );
};
