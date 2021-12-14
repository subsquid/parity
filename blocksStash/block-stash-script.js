const fs = require("fs");
const polkadot = require("@polkadot/api");
let api;
async function getBlock(blockNumber) {
  console.log('Processing block ', blockNumber)
  const hash = await api.rpc.chain.getBlockHash(blockNumber);
  const signedBlock = await api.rpc.chain.getBlock(hash);
  const allRecords = await api.query.system.events.at(
    signedBlock.block.header.hash
  );

  let finalEvents = []
  // map between the extrinsics and events
  signedBlock.block.extrinsics.forEach(
    ({ method: { method, section } }, index) => {
      // filter the specific events based on the phase and then the
      // index of our extrinsic in the block
      const events = allRecords
        .filter(
          ({ phase }) =>
            phase.isApplyExtrinsic && phase.asApplyExtrinsic.eq(index)
        )
        .map(({ event }) => {
          return {
            method: event.method,
            section: event.section,
            data: event.data.toJSON(),
            index: event.index.toJSON(),
          };
        });
      finalEvents.push({
        name:`${section}.${method}`,
        events
      })
    }
  );
  console.timeLog("executionTime");
  return {
    blockNumber,
    events: finalEvents
  }
}

async function startScript() {
  let blockEvents = [];
  api = await polkadot.ApiPromise.create({
    provider: new polkadot.WsProvider("wss://kusama-rpc.polkadot.io/"),
  });
  console.time("executionTime");
  // 9051
  for (let index = 2000; index < 4000; index++) {
    let events = await getBlock(index)
    blockEvents.push(events);
  }
  let eventsDict = JSON.stringify({blockEvents})
  await fs.writeFile('bootstrap5.json', eventsDict, function (err) {
    if (err) throw err;
    console.log('Finished!');
    process.exit(0)
  });

}
startScript();
