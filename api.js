const polk = require("@polkadot/api");
async function m() {
  let api = await polk.ApiPromise.create({
    provider: new polk.WsProvider("wss://kusama-rpc.polkadot.io/"),
  });
  const hash = await api.rpc.chain.getBlockHash(10154049);
  const parentHash = await api.rpc.chain.getBlockHash(10154048);
  //  api = await api.at(hash)
  //  const hash = '0xfa0b79064d7d480c1e31513b8c1116ef9d7a026a253befc16ec0ffeba0465ce0'
  //  const apiAt = await api.at(hash)
  // const paraId = 2008
  //  const queryData = await (await apiAt.query.registrar.paras(paraId)).toJSON()
  // const queryData = await api.query.balances.account('5CDPbtMikAFCGYtDCX6NimnAFZyYPVULVAFJajEBSzj76zrn')
  // api = await api.at(hash);
  // const [free, reserve] = await api.queryMulti([
  //   [
  //     api.query.balances.freeBalance,
  //     "EDHz5PdjufWNnd23oyRDfHR8m833KmxggJjaR7edYm9nuzM",
  //   ],
  //   [
  //     api.query.balances.reservedBalance,
  //     "EDHz5PdjufWNnd23oyRDfHR8m833KmxggJjaR7edYm9nuzM",
  //   ],
  // ]);
  // console.log(free.toBigInt());

  const ADDR = "H4XieK3r3dq3VEvRtqZR7wN7a1UEkXxf14orRsEfdFjmgkF";

  const [{ data: balanceNow }, { data: balancePrev }] = await Promise.all([
    api.query.system.account.at(hash, ADDR),
    api.query.system.account.at(parentHash, ADDR),
  ]);
  console.log(balanceNow.free.toBigInt(), balanceNow.reserved.toBigInt());
  console.log(balancePrev.free.toBigInt(), balancePrev.reserved.toBigInt());
  // console.log(
  //   BigInt(balanceNow.toJSON().reserved),
  //   BigInt(balancePrev.toJSON().reserved)
  // );
}
m();
