const polk= require("@polkadot/api")
async function m(){
 const api = await polk.ApiPromise.create({ provider: new polk.WsProvider('wss://kusama-rpc.polkadot.io/') })
 const hash = "0x1075af4efd73cbd97097c98f3cc2428007e5887692fc127830f4c31158ec5568"
 const apiAt = await api.at(hash)
 const endingPeriod = apiAt.consts.auctions?.endingPeriod.toJSON() || -1;
 const leasePeriod = apiAt.consts.slots?.leasePeriod.toJSON() || -1;
 const periods = apiAt.consts.auctions?.leasePeriodsPerSlot.toJSON() || -1;
 
 console.log(" endingPeriod ::::  ",endingPeriod)
 console.log(" leasePeriod ::::  ",leasePeriod)
 console.log(" periods ::::  ",periods)
}
m()