# confidant

[![Build Status](https://travis-ci.org/gaye/confidant.png?branch=master)](https://travis-ci.org/gaye/confidant)

Configure your project for [ninja](https://martine.github.io/ninja/)'s parallel and incremental builds with pure js.

### Overview

Confidant will scan the filesystem rooted at the directory from which it
is run for files named `configure.js`. `configure.js` files look like this:

```js
module.exports = [
  {
    inputs: ['src/**/*.js'],
    outputs: ['bundle.js'],
    rule: function(inputs, outputs) {
      // some js function to build bundle
    }
  },

  {
    inputs: ['bundle.js'],
    outputs: ['bundle.min.js'],
    rule: function(inputs, outputs) {
      // some js function to minify bundle.js
    }
  }
];
```

and transform them into a single `build.ninja` file that you can execute
with ninja.

### Configuration API

Confidant aims to be flexible and gives you a few choices when
specifying your build configuration.

#### Static Configuration

This is the simplest way to specify build rules. If you know your tasks
inputs and outputs *a priori* (before runtime) then this is what you
want. Simply export an `Array` of rule objects from your `configure.js`
module. A rule object has 3 members:

+ `inputs`: An `Array` of filenames or glob expressions for filenames that
  your task depends on
+ `outputs`: An `Array` of filenames for files that your task will create
+ `rule`: Your build function which takes the expanded inputs and outputs
  `Array`s as arguments

#### Dynamic Configuration

This option is for cases when your outputs depend on your inputs. An
example use case is if you have a directory of source files (say `src/*.c`) and
you want to turn all of them into object files. You can accomplish this
by exporting an `Array` of dynamic rule objects from your `configure.js`
module. A dynamic rule object has 3 members:

+ `inputs`: An `Array` of filenames or glob expressions for filenames that
  your task depends on
+ `outputs`: A function that takes the expanded `Array` of inputs and
  returns an `Array` of filenames for files that your task will create
+ `rule`: Your build function which takes the expanded inputs and outputs
  `Array`s as arguments

#### Asynchronous Configuration

This option is for cases when you can't know your build rules until
runtime AND you must do some asynchronous work in order to discover the
build configuration. In this case, you can export a nodejs
`stream.Readable` (`objectMode = true`) that writes static or dynamic
rule objects. The objects that you write to the stream should either
look like

```
// static case
{
  inputs: [...],
  outputs: [...],
  rule: function(inputs, outputs) {
    // ...
  }
}

// or dynamic case
{
  inputs: [...],
  outputs: function(inputs) {
    // ...
  },
  rule: function(inputs, outputs) {
    // ...
  }
}
```
### Installation

confidant is an npm package. You can install it globally with `npm
install -g confidant`. Note that it's only tested with nodejs and iojs
versions 0.12 and up.

### Usage

#### From the command line

From `confidant -h`

```
usage: confidant [-h] [-v] [--exclude EXCLUDE] dir

Command line tool to configure your ninja build in pure js

Positional arguments:
  dir                Where to search for configure.js build files

Optional arguments:
  -h, --help         Show this help message and exit.
  -v, --version      Show program's version number and exit.
  --exclude EXCLUDE  Optional comma separated list of directories to
                     omit from fs scan
```

#### From within nodejs

```js
var confidant = require('confidant');
// confidant can be invoked with an object representing its command line args
confidant({
  dir: './path/to/somewhere',
  exclude: 'bower_components,node_modules'  // Or whatever else
});
```
