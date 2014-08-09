#!/bin/bash

# tell getconfig where to find config
export GETCONFIG_ROOT=`pwd`

# passing -l here to avoid (buggy?) global leak detection
node_modules/lab/bin/lab -v -l test/index.js
