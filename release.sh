#!/bin/sh

# variables
basedir=`dirname "$0"`
workdir=`dirname "$basedir"`
releasedir="$workdir/release"

echo "build"
npm run build

# clear release dir
echo "clear $releasedir"
if [ -d "$releasedir" ]; then
    rm -rf "$releasedir"
fi

# create release dir
echo "create $releasedir"
mkdir "$releasedir"

# copy project files
cp -vr "$workdir/app" "$releasedir/app"
cp -vr "$workdir/config" "$releasedir/config"
cp -vr "$workdir/public" "$releasedir/public"

cp -v "$workdir/package.json" "$releasedir/package.json"
cp -v "$workdir/index.js" "$releasedir/index.js"
cp -v "$workdir/app.js" "$releasedir/app.js"

# release
echo "entering $releasedir & scp"
cd $releasedir

scp -r ./ root@172.16.1.118:/data/www/tracker
