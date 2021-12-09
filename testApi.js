const polk= require("@polkadot/api")
async function m(){
 const api = await polk.ApiPromise.create({ provider: new polk.WsProvider('wss://kusama-rpc.polkadot.io/') })
 const hash = "0xe0a632e3342e4d795fb756bce5fc8f7a4c35f38d875cbf5c4d97f46f55dc7036"
 const apiAt = await api.at(hash)
const paraId = 2008
 const queryData = await (await apiAt.query.registrar.paras(paraId)).toJSON()
 
 console.log(" endingPeriod ::::  ",queryData)
}
m()