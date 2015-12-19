cd gh-pages
git pull
cd ../

PACKAGE_VERSION="${npm_package_version/-/}"
SOURCE="out/$npm_package_name/v$PACKAGE_VERSION/"
ARCHIVE="gh-pages/doc/archive/v$PACKAGE_VERSION/"
MASTER=gh-pages/doc/
VERSION=`git rev-parse --short HEAD`

mkdir -p $MASTER
rm -f $MASTER*.html
cp -r $SOURCE $MASTER

mkdir -p $ARCHIVE
rm -r $ARCHIVE
cp -r $SOURCE $ARCHIVE

cd gh-pages
git add .
git commit -m "Codebase Documentation $PACKAGE_VERSION - $VERSION"

read -p "Are you shure you want to publish this Codebase version? (Y to push, everything else revert) " input

if [ "$input" = "Y" ]
	then
		git push
	else
		git checkout HEAD~1
		git checkout -B gh-pages
fi
