import { ProcessesConfigObject } from "./support/processes-config-object.mjs";
import { AppProcessConfigObject } from "./support/app-process-config-object.mjs";
import { AppAccessConfigObject } from "./support/app-access-config-object.mjs";
import { ServerProcessConfigObject } from "./support/server-process-config-object.mjs";
import { WsConfigObject } from "./support/ws-config-object.mjs";

export const getProcessesConfig = async () => new ProcessesConfigObject({
  selectedProcess: null,
  ui: new AppProcessConfigObject({
    access: new AppAccessConfigObject({
      port: 4500
    })
  }),
  be: new ServerProcessConfigObject({
    ws: new WsConfigObject({
      port: 4600
    })
  }),
});
