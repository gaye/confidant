let dirname = require('path').dirname;
let flatten = require('lodash/array/flatten');
let glob = require('glob').sync;
let isAbsolute = require('path').isAbsolute;
let ninjaEscape = require('./escape').ninjaEscape;

exports.getOutputs = function(file, task, inputs) {
  let result;
  if (Array.isArray(task.outputs)) {
    result = task.outputs;
  } else if (typeof task.outputs === 'function') {
    result = task.outputs(inputs);
  } else {
    result = [task.outputs];
  }

  let dir = dirname(file);
  return result.map(output => isAbsolute(output) ? output : `${dir}/${ninjaEscape(output)}`);
};

exports.getInputs = function(file, task) {
  let dir = dirname(file);
  return flatten(
    task.inputs.map(input => isGlobExpression(input) ? glob(input, { cwd: dir }) : input),
    true
  )
  .filter(input => input.indexOf(' ') === -1)  // ninja can't handle ws
  .map(input => `${dir}/${ninjaEscape(input)}`);
};

function isGlobExpression(expression) {
  return expression.includes('*') ||
         expression.includes('?') ||
         expression.includes('[') ||
         expression.includes('!') ||
         expression.includes('+') ||
         expression.includes('@');
}
