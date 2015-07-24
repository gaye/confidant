var exec = require('child_process').execSync;

module.exports = [
  {
    inputs: [],
    outputs: 'success',
    rule: function() {
      if (process.env.ENV_TEST === '1') {
        exec(`echo ${process.env.ENV_TEST} > success`);
      }
    }
  }
];
