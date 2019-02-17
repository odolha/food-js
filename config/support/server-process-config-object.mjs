import { ProcessConfigObject } from "./process-config-object.mjs";

export class ServerProcessConfigObject extends ProcessConfigObject {

  constructor(configSpec = {}) {
    super({ ...configSpec, type: 'server' });
  }

  toString() {
    return `${super.toString()} WS-Port: ${this.ws.port}`;
  }

}
