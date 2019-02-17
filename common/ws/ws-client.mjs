import { equalTo } from "../utils/predicate.mjs";
import { identity, jsonTryParse } from "../utils/mapper.mjs";
import { stringify } from "../utils/stringify.mjs";
import { Container } from "../container.mjs";

export const events = {
  opening: 'opening',
  opened: 'opened',
  closed: 'closed',
  error: 'error',
  reconnected: 'reconnected'
};

const defaultOptions = {
  reconnectTimeoutMs: 5000,
  silentControlMessages: false,
  silentReconnect: false,
  silentErrors: false,
  silentSend: false,
  sillySend: false,
  silentReceive: false,
  sillyReceive: true
};

export class WsClient {

  constructor(url) {
    this.logger = Container.principal.obtain('logger');
    this.url = url;
    this.connected = false;
    this.dataBus = new rxjs.Subject();
  }

  async init(reconnect = false) {
    this.connected = false;
    this.ws = new WebSocket(this.url);
    this.connecting = new Promise((resolve, reject) => {
      this.ws.onopen = () => {
        this.logger.verbose('WS client connection open', this.url);
        this.connected = true;
        resolve();
        this.ws.onmessage = msg => this.onReceive(msg);
      };
      this.ws.onclose = () => {
        this.connected = false;
        this.logger.info('WS client connection closed', this.url);
        if (reconnect && this.initialized) {
          this.tryReconnect();
        }
      };
      this.ws.onerror = (error) => {
        this.logger.warn('WS client error', this.url);
        this.logger.warn(stringify(error));
        reject(error);
      }
    });

    this.initialized = true;

    return await this.connecting;
  }

  async whenConnected() {
    if (!this.connected) {
      await this.connecting;
    }
  }

  tryReconnect(timeout = 5000) {
    if (!timeout || this._reconnectTimeout) {
      return;
    }
    this.logger.verbose(`Connection lost, reconnecting in ${(timeout/1000).toFixed(0)}s`);
    this._reconnectTimeout = setTimeout(async () => {
      if (!this.connected) {
        try {
          await this.init(true);
          this._reconnectTimeout = null;
        } catch (e) {
          this._reconnectTimeout = null;
          this.tryReconnect(timeout);
        }
      }
    }, timeout);
  }

  onReceive(msg) {
    this.dataBus.next(msg.data || msg);
  }

  async send(msg) {
    await this.whenConnected();
    if (!this.ws) {
      this.logger.error(`Trying to send message but WS not connected: ${this.url}`)
    }
    await this.ws.send(msg);
  }

  async sendJson(msg, retry) {
    return await this.send(JSON.stringify(msg), retry);
  }

  receiveJson({ filterFn = () => true, mappingFn = identity }) {
    return this.receive({ filterFn, mappingFn, preTransformFn: jsonTryParse });
  }

  async receiveOne({ filterFn = () => true, mappingFn = identity, preTransformFn = identity }) {
    return await this.receive({ filterFn, mappingFn, preTransformFn })
      .take(1)
      .toPromise();
  }

  async receiveOneJson({ filterFn = () => true, mappingFn = identity }) {
    return await this.receiveOne({ filterFn, mappingFn, preTransformFn: jsonTryParse });
  }

  async converse({ outboundMessage, incomingFilter, incomingMapper = identity }) {
    const promise = this.receiveOne({ filterFn: incomingFilter, mappingFn: incomingMapper });
    this.send(outboundMessage);
    return await promise;
  }

  async converseJson({ outboundMessage, incomingFilter, incomingMapper = identity }) {
    const promise = this.receiveOneJson({ filterFn: incomingFilter, mappingFn: incomingMapper });
    this.sendJson(outboundMessage);
    return await promise;
  }

  async converseCorrelatedJson({ outboundMessage, incomingMapper = identity }) {
    const filterFn = item => item.correlationId === outboundMessage.correlationId;
    const promise = this.receiveOneJson({ filterFn, mappingFn: incomingMapper });
    this.sendJson(outboundMessage);
    return await promise;
  }

  async ping() {
    return await this.converse({ outboundMessage: 'ping', incomingFilter: equalTo('"pong"') });
  }

  async close() {
    if (this.connected) {
      this.logger.verbose('Closing WS client underlying connection', this.url);
      await this.ws.close();
    }
  }

  async destroy() {
    this.logger.verbose('Destroying WS client', this.url);
    this.initialized = false;
    this.close();
  }

}
