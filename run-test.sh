#!/bin/bash

# tell getconfig where to find config
export GETCONFIG_ROOT=`pwd`

node_modules/lab/bin/lab -v test/index.js
