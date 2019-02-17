import { obtain } from "./app.container.js";
import { initConfigs } from "../../config/master.config.mjs";
import { WsClient } from "../../common/ws/ws-client.mjs";

let _appInit = null;

export const appInit = async () => {
  const imports = async () => {
    await import('./app.context.js');
    await import('./app.filters.js');
    await import('./app.directives.js');
    await import('./app.components.js');
  };

  const initWs = async () => {
    await obtain(WsClient).init(true);
  };

  _appInit = (async () => {
    try {
      await initConfigs();
      await imports();
      await initWs();
      obtain('logger').verbose('@foodjs/ui CLIENT started');
      _appInit = null;
    } catch (e) {
      obtain('logger').error('@foodjs/ui CLIENT failed', e);
    }
  })();

  await _appInit;
};
