import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

const EnjoyHigherModule = buildModule('EnjoyHigherModule', (m) => {
  const name = 'Higher';
  const symbol = 'HIGHER';
  const tokenAddress = '0x0578d8A44db98B23BF096A382e016e29a5Ce0ffe';
  const enjoyHigher = m.contract('Enjoyr', [name, symbol, tokenAddress]);

  return { enjoyHigher };
});

export default EnjoyHigherModule;
