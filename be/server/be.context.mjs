import { linkAll, register } from "./be.container.mjs";
import { WsServer } from "../ws/ws-server.mjs";
import { WsController } from "../ws/ws-controller.mjs";
import { masterConfig } from "../../config/master.config.mjs";
import { beRoutes } from "./be.routes.mjs";

register(WsServer, new WsServer(masterConfig.processes.be.ws));
register(WsController, new WsController({
  routes: beRoutes
}));

linkAll();
