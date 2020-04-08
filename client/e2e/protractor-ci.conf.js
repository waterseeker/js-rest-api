const config = require('./protractor.conf').config;

config.ignoreUncaughtExceptions = true;
config.chromeDriver = process.env.CHROMEWEBDRIVER;
config.capabilities = {
  browserName: 'chrome',
  chromeOptions: {
    args: ['--headless', '--no-sandbox', '--disable-gpu'],
  }
};

exports.config = config
