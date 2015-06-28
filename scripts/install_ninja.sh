#!/bin/bash

main() {
  git clone https://github.com/martine/ninja
  cd ninja
  ./configure.py --bootstrap
  export PATH=$PATH:$(pwd)
}

main "$@"
