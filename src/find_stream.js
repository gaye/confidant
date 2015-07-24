/**
 * @fileoverview Executes find and sends the results through a stream.
 */

let Readable = require('stream').Readable;
let debug = require('debug')('confidant/find_stream');
let exec = require('mz/child_process').exec;
let exists = require('fs').existsSync;
let inherits = require('util').inherits;
let path = require('path');

let defaultOptions = Object.freeze({ exclude: [] });

/**
 * Options:
 *
 *   (Array) exclude - directories to omit from fs scan.
 */
function FindStream(dir, options={}) {
  Readable.call(this, { objectMode: true });
  options = Object.assign({}, defaultOptions, options);

  this.buffer = [];
  this.finished = false;

  if (path.isAbsolute(dir)) {
    this.dir = dir;
  } else {
    this.dir = path.resolve(process.cwd(), dir);
  }

  debug(`Scanning ${dir} for configure.js files...`);

  let exclude = options.exclude;
  let cmd;
  if (!exclude.length) {
    cmd = 'find . -type d';
  } else {
    cmd = 'find . -type d \\( ' +
          exclude.map(dir => `-name ${dir}`).join(' -o ') +
          ' \\) -prune -o -print';
  }

  exec(cmd, { cwd: this.dir, maxBuffer: 8 * Math.pow(10, 6) }).then(result => {
    let stdout = result[0];
    let dirs = stdout.split(/(\n|\r)/).filter(line => !/^\s*$/.test(line));
    let files = dirs
      .map(dir => path.resolve(this.dir, dir, 'configure.js'))
      .filter(exists);
    files.forEach(file => {
      debug(`Found ${file}`);
      this.buffer.push(file);
    });
    this.finished = true;
  });
}
inherits(FindStream, Readable);
module.exports = FindStream;

FindStream.prototype._read = function() {
  if (this.buffer.length) {
    return this.push(this.buffer.shift());
  }

  if (this.finished && !this.buffer.length) {
    return this.push(null);
  }

  // We haven't read anything yet so we should poll... ew.
  return setTimeout(this._read.bind(this), 10);
};
