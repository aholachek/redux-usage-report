'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

exports.default = saveReport;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = require('fs');

function saveReport(global) {
  var report = global.reduxReport.generate();
  if (!fs || !report) throw new Error('Could not save redux use report');

  var reportTypes = ['used', 'unused'];
  reportTypes.forEach(function (descriptor) {
    fs.writeFile('./redux_report--' + descriptor + '.json', (0, _stringify2.default)(report[descriptor]), function (err) {
      if (err) throw err;
      console.log('The ' + descriptor + ' redux report has been saved!');
    });
  });
}