const config = require('./protractor.conf').config;

config.chromeDriver = process.env.CHROMEWEBDRIVER;
config.capabilities = {
  browserName: 'chrome',
  chromeOptions: {
    args: ['--headless', '--no-sandbox', '--disable-gpu']
  }
};

exports.config = config
