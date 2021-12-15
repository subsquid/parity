const fs = require("fs");
const polkadot = require("@polkadot/api");
let api;
async function getBlockTimeStamp(blockNumber) {
  console.log('Processing block ', blockNumber)
  const hash = await api.rpc.chain.getBlockHash(blockNumber);
  const time =await api.query.timestamp.now.at(hash);
  console.timeLog("executionTime");
  return {
    blockNumber,
    timestamp: time.toNumber()
  }
}

async function startScript() {
  let timestamps = [];
  api = await polkadot.ApiPromise.create({
    provider: new polkadot.WsProvider("wss://kusama-rpc.polkadot.io/"),
  });
  console.time("executionTime");
  for (let index = 8000; index < 9051; index++) {
    let timestamp = await getBlockTimeStamp(index)
    timestamps.push(timestamp);
  }
  let eventsDict = JSON.stringify({timestamps})
  await fs.writeFile('timestamp4.json', eventsDict, function (err) {
    if (err) throw err;
    console.log('Finished!');
    process.exit(0)
  });

}
startScript();
