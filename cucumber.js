const fs = require('fs-extra');

fs.ensureDirSync('./test-results/reports');
fs.removeSync('./test-results/screenshots');
fs.removeSync('./test-results/videos');

let options = [
  '--require tests/steps/**/*.js', //path to your steps
  '--require tests/support/globalHooks.js', //to use the helper class
  '--format summary',
  '--format json:./test-results/reports/cucumber.json',
].join(' ');

let runner = [
  'tests/features/**/*.feature',
  options,
].join(' ');

module.exports = { runner }
