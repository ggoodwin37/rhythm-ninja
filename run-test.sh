#!/bin/bash

TEST_CONFIG_PATH="node_modules/lab/bin/test_config.json"

# kind of corny, make a copy of the dev config for test runner to see.
# could also make a separate test_config.json and copy that instead.
cp -f dev_config.json ${TEST_CONFIG_PATH}

# passing -l here to avoid (buggy?) global leak detection
node_modules/lab/bin/lab -v -l test/index.js
