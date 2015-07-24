let ArgumentParser = require('argparse').ArgumentParser;
let FindStream = require('./find_stream');
let NinjaStream = require('./ninja_stream');
let createWriteStream = require('fs').createWriteStream;

let parser = new ArgumentParser({
  version: require('../package').version,
  description: 'Command line tool to configure your ninja build in pure js',
  addHelp: true
});

parser.addArgument(['dir'], {
  help: 'Where to search for configure.js build files',
  type: 'string',
  defaultValue: process.cwd()
});

parser.addArgument(['--exclude'], {
  help: 'Optional comma separated list of directories to omit from fs scan',
  type: 'string',
  defaultValue: 'bower_components,node_modules'
});

module.exports = function main(args = parser.parseArgs()) {
  let dir = args.dir;
  let readerOpts = {};
  let exclude = args.exclude;

  if (exclude) {
    readerOpts.exclude = exclude.split(',');
  }

  let reader = new FindStream(dir, readerOpts);
  let writer = createWriteStream(`${dir}/build.ninja`);
  let ninja = new NinjaStream();

  reader
    .pipe(ninja)
    .pipe(writer);

  return new Promise(resolve => writer.on('finish', resolve));
};
