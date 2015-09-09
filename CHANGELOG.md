### 0.6.0

+ Confidant now allows outputs to be specified with a function that
  takes expanded inputs array

### 0.5.0

+ Confidant no longer serializes your `configure.js` and instead loads
  it at build time (as well as configure time).

### 0.4.0

+ Environment variables now get passed from confidant to the processes
  that run your js build rules. Thanks @rickychien!

### 0.3.0

+ You can now export a nodejs readable stream instead of an array of
  build rules for cases when you need to do some things asynchronously
  to determine your build rules.

### 0.2.4

+ Write your build rules as nodejs functions while specifying inputs and
  outputs
+ Build rules get tranformed into ninja configuration
