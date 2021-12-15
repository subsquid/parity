const polk= require("@polkadot/api")
async function m(){
 let api = await polk.ApiPromise.create({ provider: new polk.WsProvider('wss://kusama-rpc.polkadot.io/') })
 const hash = await api.rpc.chain.getBlockHash(10525029);
 const parentHash = await api.rpc.chain.getBlockHash(10525028);
//  api = await api.at(hash)
//  const hash = '0xfa0b79064d7d480c1e31513b8c1116ef9d7a026a253befc16ec0ffeba0465ce0'
//  const apiAt = await api.at(hash)
// const paraId = 2008
//  const queryData = await (await apiAt.query.registrar.paras(paraId)).toJSON()
// const queryData = await api.query.balances.account('5CDPbtMikAFCGYtDCX6NimnAFZyYPVULVAFJajEBSzj76zrn')
// const [free,reserve] = await Promise.all([
//     api.query.balances.freeBalance('EDHz5PdjufWNnd23oyRDfHR8m833KmxggJjaR7edYm9nuzM'),
//     api.query.balances.reservedBalance('EDHz5PdjufWNnd23oyRDfHR8m833KmxggJjaR7edYm9nuzM'),
    
// ])
const ADDR = 'F3opxRbN5ZZRfqouvNLRPubUbNPXUNgUXbxReLRTuhC1JXp'

const [{ data: balanceNow }, { data: balancePrev }] = await Promise.all([
    api.query.system.account.at(hash, ADDR),
    api.query.system.account.at(parentHash, ADDR)
  ]);
// const [free] = await api.query.balances.freeBalance('5DhgKm3m7Yead8oaH7ANKhvQzAqoEexnEJTzBkqh9kYf47ou')

 
 console.log(balanceNow.toJSON(),balancePrev.toJSON())
 console.log(parseInt(balanceNow.toJSON().reserved),parseInt(balancePrev.toJSON().reserved))

}
m()