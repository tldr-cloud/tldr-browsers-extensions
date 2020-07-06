#!/bin/zsh

zip -r -FS ../firefox-extension.zip * --exclude '*.git*' -x 'build.sh'