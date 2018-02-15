var fs = require('fs');

export default function saveReport(global) {
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