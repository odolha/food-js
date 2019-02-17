import { linkAll, register } from "./app.container.js";
import { WsClient } from "../../common/ws/ws-client.mjs";
import { AppWsClient } from "../utils/app-ws-client.js";
import { SimpleLogger } from "../../common/utils/simple-logger.mjs";
import { masterConfig } from "../../config/master.config.mjs";

register('logger', new SimpleLogger());

register([WsClient, AppWsClient], new AppWsClient(masterConfig.processes.be.ws.getLocalNetworkEndpoint()));

linkAll();
