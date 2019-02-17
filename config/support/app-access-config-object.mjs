import { ConfigObject } from "./config-object.mjs";

export class AppAccessConfigObject extends ConfigObject {

  getLocalUrl(secure = false) {
    return `http${secure ? 's' : ''}://localhost:${this.port}`;
  }

  getLocalNetworkUrl(secure = false) {
    return `http${secure ? 's' : ''}://${this.$root.infrastructure.internalIp}:${this.port}`;
  }

}