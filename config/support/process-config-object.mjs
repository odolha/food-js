import { ConfigObject } from "./config-object.mjs";

export class ProcessConfigObject extends ConfigObject {

  toString() {
    return `${this.getCode()} [${this.type}]`;
  }

}