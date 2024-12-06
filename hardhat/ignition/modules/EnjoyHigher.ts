import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

const EnjoyHigherModule = buildModule('EnjoyHigherModule', (m) => {
  const enjoyHigher = m.contract('EnjoyHigher', []);

  return { enjoyHigher };
});

export default EnjoyHigherModule;
