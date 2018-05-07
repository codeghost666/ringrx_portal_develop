#!/bin/bash

mkdir /tmp/phantomjs
curl -L https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-2.1.1-linux-x86_64.tar.bz2 | tar -xvj -C /tmp/phantomjs --strip-components=1 phantomjs-2.1.1-linux-x86_64/bin
mv /tmp/phantomjs/bin/phantomjs /usr/bin
rm -rf /tmp/phantomjs