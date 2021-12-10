const polk= require("@polkadot/api")
async function m(){
 const api = await polk.ApiPromise.create({ provider: new polk.WsProvider('wss://kusama-rpc.polkadot.io/') })
//  const hash = '0xfa0b79064d7d480c1e31513b8c1116ef9d7a026a253befc16ec0ffeba0465ce0'
//  const apiAt = await api.at(hash)
// const paraId = 2008
//  const queryData = await (await apiAt.query.registrar.paras(paraId)).toJSON()
// const queryData = await api.query.balances.account('5CDPbtMikAFCGYtDCX6NimnAFZyYPVULVAFJajEBSzj76zrn')
const queryData = await api.query.balances.locks('5FA2jYeaoLNYBkGvNAJCwiFU2WfVDwgEm23NxH3Kv2qZuDxj')

 
 console.log(" endingPeriod ::::  ",queryData.toJSON())
}
m()