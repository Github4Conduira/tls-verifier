# run from node directory

set -e
# install crypto-sdk
cd ../crypto-sdk
npm i
npm run build

echo "installed crypto-sdk"
cd ../zk
npm i
npm run build:tsc

echo "installed zk"

cd ../node
npm i

echo "installed node"

