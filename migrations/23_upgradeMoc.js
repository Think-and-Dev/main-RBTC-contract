const MoCLib = artifacts.require('./MoCHelperLib.sol');
const Moc = artifacts.require('./MoC.sol');
const MoCExchange = artifacts.require('./MoCExchange.sol');
const ProxyAdmin = artifacts.require('ProxyAdmin');
const AdminUpgradeabilityProxy = artifacts.require('AdminUpgradeabilityProxy');

module.exports = async deployer => {
  const mocLib = await MoCLib.at('0x71811394c7Fb1C4cbF9D25970A0f7001E58Cf55F');
  const proxyAdmin = await ProxyAdmin.at('0x03cE6B189F63563BFfA070f9E1768413CE1D0f36');
  const proxyMoc = await AdminUpgradeabilityProxy.at('0x71d0921010CA8367835D34F7F3d215047E307581');
  const proxyMocExchange = await AdminUpgradeabilityProxy.at(
    '0x9516644aAFb05a13C97C575d1890aF2A50B8EE6A'
  );

  await Moc.link(MoCLib, mocLib.address);
  await MoCExchange.link(MoCLib, mocLib.address);

  const moc = await deployer.deploy(Moc);
  const mocExchange = await deployer.deploy(MoCExchange);

  await proxyAdmin.upgrade(proxyMoc.address, moc.address);
  await proxyAdmin.upgrade(proxyMocExchange.address, mocExchange.address);
};
