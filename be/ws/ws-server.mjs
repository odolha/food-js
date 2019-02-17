import WebSocket from 'ws';
import { stringify } from "../../common/utils/stringify.mjs";
import { Container } from "../../common/container.mjs";

export class WsServer {

  constructor(wsConfig) {
    this.logger = Container.principal.obtain('logger');
    this.wsConfig = wsConfig;

    this.activeStreamSubs = {};
  }

  init(wsController) {
    this.wss = new WebSocket.Server({port: this.wsConfig.port});

    this.wss.on('connection', (ws, req) => {
      const ip = req.connection.remoteAddress;
      this.logger.verbose('Incoming connection', ip);

      if (!this.wsConfig.isIpWhiteListed(ip)) {
        this.logger.warn('IP not in whitelist. Connection will be refused.');
        ws.close();
        return;
      }

      wsController.init(ws);

      ws.on('message', async (message) => {
        this.logger.debug('WS server message', stringify(message));
        let response;
        if (message.startsWith('$stopStream:')) {
          const correlationId = message.replace('$stopStream:', '');
          const sub = this.activeStreamSubs[correlationId];
          if (sub) {
            sub.unsubscribe();
          } else {
            this.logger.warn(`Tried to stop stream with original correlationId: ${correlationId}, but no subscription was registered`);
          }
          return;
        }
        try {
          response = await wsController.onMessage(message);
        } catch (e) {
          ws.send(`ERROR: ${stringify(e)}`);
          throw e;
        }
        if (response) {
          if (response instanceof Promise) {
            const awaitedResponse = await response;
            if (awaitedResponse) {
              try {
                ws.send(awaitedResponse);
              } catch (e) {
                this.logger.caution('Can no longer send message. Most likely the client is no longer connected.');
                this.logger.sillyStack(e);
              }
            }
          } else {
            try {
              ws.send(response);
            } catch (e) {
              this.logger.caution('Can no longer send message. Most likely the client is no longer connected.');
              this.logger.sillyStack(e);
            }
          }
        }
      });
    });

    this.logger.verbose('WS server running on port', this.wsConfig.port);
  }

}
