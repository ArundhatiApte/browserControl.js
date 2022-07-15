#!/bin/sh

rm browserControl.package.tar.gz

tar -czvf browserControl.package.tar.gz \
  --transform='s,^,package/,'\
  --exclude='test*'\
  ./../../src/common/ControllingSockets/common\
  ./../../src/common/ControllingSockets/ControllingSide\
  ./../../src/common/ResponsiveWebSockets/common\
  ./../../src/common/ResponsiveWebSockets/Server\
  ./../../src/common/valueView\
  ./../../src/server\
  ./../../package.json\
  ./../../../LICENCE\
  ./../../../README.md
