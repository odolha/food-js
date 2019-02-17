import { ConfigObject } from "./config-object.mjs";

export class WsConfigObject extends ConfigObject {

  getLocalEndpoint() {
    return this.getReferencedNetworkEndpoint('localhost');
  }

  getLocalNetworkEndpoint() {
    return this.getReferencedNetworkEndpoint(this.$root.infrastructure.internalIp)
  }

  getReferencedNetworkEndpoint(ipOrName) {
    return `ws://${ipOrName}:${this.port}`;
  }

  getIpWhiteList() {
    return [
      '::1',
      '::ffff:127.0.0.1',
      /::ffff:192\.168\.1\.d+/,
      `::ffff:${this.$root.infrastructure.internalIp}`
    ];
  }

  isIpWhiteListed(checkIp) {
    return this.getIpWhiteList().some(ip => {
      if (typeof ip === 'string') {
        return ip === checkIp;
      } else {
        return checkIp.match(ip);
      }
    });
  }

}
