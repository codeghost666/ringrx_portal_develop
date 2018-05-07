#!/bin/bash

git clone https://github.com/facebook/watchman.git /tmp/watchman
cd /tmp/watchman
git checkout v4.9.0  # the latest stable release
./autogen.sh
./configure --without-python
make
make install
cd /
rm -rf /tmp/watchman