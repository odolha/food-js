import './utils/libs.mjs';
import "../common/utils/enhance.mjs";
import { initProcess } from "./utils/process-init.mjs";

initProcess('be', async () => {
  await import('./server/be.container.mjs');
  await import('./server/be.mjs');
});
