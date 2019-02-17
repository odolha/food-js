import { ConfigObject } from "./config-object.mjs";

export class MasterConfigObject extends ConfigObject {

  constructor(configSpecs) {
    super(configSpecs);

    this.init(this, this);
  }

}