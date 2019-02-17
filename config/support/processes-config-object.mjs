import { ConfigObject } from "./config-object.mjs";

export class ProcessesConfigObject extends ConfigObject {

  getCurrentProcess() {
    return this[this.selectedProcess];
  }

}