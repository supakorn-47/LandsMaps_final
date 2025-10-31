const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  // Proxy API calls during development to avoid CORS
  const target = 'https://100.65.4.47:7293';
  const commonOptions = {
    target,
    changeOrigin: true,
    secure: false,
    logLevel: 'silent',
  };

  app.use('/backOfficeApi', proxy(commonOptions));
  app.use('/apiWebPortal', proxy(commonOptions));
  app.use('/api', proxy(commonOptions));
  app.use('/export', proxy(commonOptions));
};

