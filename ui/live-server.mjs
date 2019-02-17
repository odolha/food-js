import fs from 'fs';
import open from 'opn';
import liveServer from "live-server";

import '../be/utils/libs.mjs';
import "../common/utils/enhance.mjs";

import { initProcess } from "../be/utils/process-init.mjs";
import { masterConfig } from "../config/master.config.mjs";

let originalMasterConfig;

const initFn = async () => {
  originalMasterConfig =  fs.readFileSync('./config/master.config.mjs', "utf8");
};

const jsString = val => val ? `'${val}'` : 'undefined';

let alteredMasterConfig;

const afterInitFn = async () => {
  const ignored = /^((\/\.idea)|(\/\.git)|(\/be)|(\/config\/secrets)|(\/docs)).+$/;

  const params = {
    port: masterConfig.processes.getCurrentProcess().access.port,
    open: false,
    root: "./",
    file: "./ui/index.html",
    wait: 1000,
    watch: './common,./ui',
    logLevel: 1,
    middleware: [function(req, res, next) {
      if (ignored.test(req.url)) {
        console.warn(`${req.url} Forbidden`);
        res.statusCode = 403;
        res.end('Forbidden');
      } else if (req.url.endsWith('config/master.config.mjs')) {
        res.statusCode = 200;
        res.setHeader('content-type', 'application/javascript; charset=UTF-8');
        res.end(alteredMasterConfig);
      } else {
        next();
      }
    }]
  };

  liveServer.start(params);

  open(masterConfig.processes.getCurrentProcess().access.getLocalUrl());
};

const afterCheckFn = async () => {
  alteredMasterConfig = `${originalMasterConfig}
    // injected configs from live-server.mjs (provides clients with relevant process-initialized info)
    afterInit = () => {
      masterConfig.infrastructure.internalIp = ${jsString(masterConfig.infrastructure.internalIp)};
    };
  `;
};

initProcess('ui', initFn, afterInitFn, afterCheckFn);
