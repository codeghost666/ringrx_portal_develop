#!/bin/bash

if [ $(uname | grep 'MINGW64') ]
then
	winpty docker run --rm -it -p 4200:4200 -p 7020:7020 -p 3000:3000 -e RAILS_ENV=development  -v $(pwd -W | sed 's|/|\\|g'):/source ringrx/ci-portal
else
	docker run --rm -it -p 4200:4200 -p 7020:7020 -p 3000:3000 -e RAILS_ENV=development  -v $(pwd):/source ringrx/ci-portal
fi
