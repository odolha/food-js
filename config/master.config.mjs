import { MasterConfigObject } from "./support/master-config-object.mjs";
import { getInfrastructureConfig } from "./infrastructure.config.mjs";
import { getProcessesConfig } from "./processes.config.mjs";

export let masterConfig = null;

// use to add alteration functions to config
const masterConfigAlterationFns = [];

export const initConfigs = async () => {
  masterConfig = new MasterConfigObject({
    infrastructure: await getInfrastructureConfig(),
    processes: await getProcessesConfig()
  });
  afterInit();
};

export const alterMasterConfig = fn => {
  // keep as we need to re-do them on UI init
  masterConfigAlterationFns.push(fn);
  fn(masterConfig);
};

// allows injecting initialize hook code (e.g. when serving this on a client)
let afterInit = () => {};
