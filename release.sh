#!/bin/sh

# variables
basedir=`dirname "$0"`
workdir=`dirname "$basedir"`
releasedir="$workdir/release"

# clear release dir
echo "clear $releasedir"
if [ -d "$releasedir" ]; then
    rm -rf "$releasedir"
fi

# create release dir
echo "create $releasedir"
mkdir "$releasedir"

# copy project files
cp -v "$workdir/package.json" "$releasedir/package.json"
cp -v "$workdir/index.js" "$releasedir/index.js"
cp -vr "$workdir/app" "$releasedir/app"
cp -vr "$workdir/config" "$releasedir/config"

# release
echo "entering $releasedir & scp"
cd $releasedir

scp -P 36000 -r ./ root@172.16.1.10:/data1/fe_www/docs-server