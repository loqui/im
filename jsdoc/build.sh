rm -r out/
grunt docstrap
cd node_modules/ink-docstrap/
bower i
npm i
grunt less
cd ../../
jsdoc src/scripts/loqui/ jsdoc/ --private -r -t node_modules/ink-docstrap/template/ -c jsdoc/config.json --package package.json
