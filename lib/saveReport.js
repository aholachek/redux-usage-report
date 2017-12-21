'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = saveReport;
var fs = require('fs');

function saveReport(global) {
  var report = global.reduxReport.generate();
  if (!fs || !report) throw new Error('Could not save redux use report');

  var reportTypes = ['used', 'unused'];
  reportTypes.forEach(function (descriptor) {
    fs.writeFile('./redux_report--' + descriptor + '.json', JSON.stringify(report[descriptor]), function (err) {
      if (err) throw err;
      console.log('The ' + descriptor + ' redux report has been saved!');
    });
  });
}