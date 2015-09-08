var assert = require('assert');
var exec = require('child_process').execSync;

module.exports = [
  {
    inputs: ['*.coffee'],
    outputs: function(inputs) {
      return inputs.map(function(input) {
        return input.replace('.coffee', '.js');
      });
    },
    rule: function(inputs, outputs) {
      var src = inputs[0];
      var dest = outputs[0];
      exec('cp ' + src + ' ' + dest);
    }
  }
];
