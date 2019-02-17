import { notify } from "./notify.js";
import { WsClient } from "../../common/ws/ws-client.mjs";

export class AppWsClient extends WsClient {

  onReceive(msg) {
    if (typeof msg === 'string' && msg.indexOf('ERROR') === 0) {
      notify('alert', `Fatal\n${msg}`);
    }
    return super.onReceive(msg);
  }

}