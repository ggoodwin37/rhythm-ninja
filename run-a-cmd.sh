#!/bin/bash

# tell getconfig where to find config
export GETCONFIG_ROOT=`pwd`

node command-scripts/$1/index.js
