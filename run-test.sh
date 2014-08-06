#!/bin/bash

# kind of corny, make a copy of the dev config for test runner to see.
# could also make a separate test_config.json and copy that instead.
if [ ! -f node_modules/lab/bin/test_config.json ]
then
	cp dev_config node_modules/lab/bin/test_config.json
fi

# passing -l here to avoid (buggy?) global leak detection
node_modules/lab/bin/lab -v -l test/index.js
