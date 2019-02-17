import './be.context.mjs';
import { obtain } from "./be.container.mjs";
import { WsServer } from "../ws/ws-server.mjs";
import { WsController } from "../ws/ws-controller.mjs";

obtain(WsServer).init(obtain(WsController));
