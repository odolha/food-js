import { ProcessConfigObject } from "./process-config-object.mjs";

export class AppProcessConfigObject extends ProcessConfigObject {

  constructor(configSpec = {}) {
    super({ ...configSpec, type: 'app' });
  }

  toString() {
    return `${super.toString()} Access-Port: ${this.access.port}`;
  }

}
