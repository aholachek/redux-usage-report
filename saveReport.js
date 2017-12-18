const fs = require('fs');

export default saveReport = () => {
  const report = globalObjectCache.reduxReport.get();
  if (!fs || !report) throw new Error('Could not save redux use report');

  ['used', 'unused'].forEach(descriptor => {
    fs.writeFile(`./redux_report--${descriptor}.json`, JSON.stringify(report[descriptor]), err => {
      if (err) throw err;
      console.log(`The ${descriptor} redux report has been saved!`);
    });
  });
};
