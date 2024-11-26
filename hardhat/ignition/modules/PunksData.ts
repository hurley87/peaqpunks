import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

const PunksDataModule = buildModule('PunksDataModule', (m) => {
  const punksData = m.contract('PunksData', []);

  return { punksData };
});

export default PunksDataModule;
