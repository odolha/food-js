import { isFunction } from "../../common/utils/types.mjs";
import { stringify } from "../../common/utils/stringify.mjs";
import { Container } from "../../common/container.mjs";

export class WsController {

  constructor({routes}) {
    this.logger = Container.principal.obtain('logger');
    this.routes = routes;
  }

  init(ws) {
    this.ws = ws;
  }

  matchRoute(message) {
    return this.routes.find(route => route.on === message || isFunction(route.on) && route.on(message));
  }

  async onMessage(message) {
    let parsedMessage = message;
    try {
      parsedMessage = JSON.parse(message);
    } catch (e) {
      // not JSON, it's ok though
      this.logger.debug('Cannot JSON stringify message', message);
    }
    const routeDef = this.matchRoute(parsedMessage);
    if (routeDef) {
      let res;
      try {
        res = routeDef.route(parsedMessage);
      } catch (e) {
        this.logger.errorStack('Route error', e);
        return `Route error | ${stringify(e)}`;
      }
      if (res instanceof Promise) {
        try {
          res = await res;
        } catch (e) {
          this.logger.errorStack('Route error', e);
          throw e;
        }
      }
      return this.toResponseMessage(res);
    } else {
      const msg = `No route matched for message: ${stringify(parsedMessage)}`;
      this.logger.warn(msg);
      return msg;
    }
  }

  toResponseMessage(res) {
    try {
      return JSON.stringify(res);
    } catch (e) {
      // not JSON, return as is
      this.logger.warnStack('Cannot JSON stringify route response');
      this.logger.warn(stringify(res));
      return res;
    }
  }

}
