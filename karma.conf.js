process.env.CHROME_BIN = require('puppeteer').executablePath()

module.exports = function (config) {
  config.set({
    singleRun: true,
    frameworks: ['jasmine', 'karma-typescript'],
    files: [
      'src/**/*.ts',
      'test/__browser__/**/*.ts',
      {
        pattern: 'test/data/**/*',
        watched: false,
        included: false,
        served: true,
        nocache: false,
      },
    ],
    preprocessors: {
      '**/*.ts': 'karma-typescript',
    },
    reporters: ['progress', 'karma-typescript'],
    browsers: ['ChromeHeadless'],
    karmaTypescriptConfig: {
      include: ['src/', 'test/__browser__/'],
    },
  })
}
