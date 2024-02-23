const fs = require('fs-extra');

// Sicherstellen, dass das Verzeichnis für Testergebnisse existiert
fs.ensureDirSync('./test-results/reports');
fs.removeSync('./test-results/screenshots');
fs.removeSync('./test-results/videos');

let options = [
  '--require tests/steps/**/*.js', // Pfad zu deinen Schrittdefinitionen
  '--require tests/support/globalHooks.js',
  '--format summary', // Zusammenfassung der Testergebnisse
  '--format json:./test-results/reports/cucumber.json', // JSON-Report
].join(' ');

let runner = [
  'tests/features/**/*.feature',
  options,
].join(' ');


module.exports = { runner }
