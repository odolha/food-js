import util from "util";
import yargs from 'yargs';
import { doNothing } from "../../common/utils/consumer.mjs";
import { initConfigs, masterConfig } from "../../config/master.config.mjs";
import { getInternalIp } from "./ip-utils.mjs";

const {argv} = yargs;

let _processCode;
let _exit = false;

const exitHandler = exitEvent => async exitCode => {
  if (!_exit) {
    _exit = true;

    try {
      console.info(`\n@foodjs/${_processCode} exited (${exitEvent}) [${exitCode}]`);
    } catch (e) {
      console.info(`\n@foodjs/${_processCode} exited (${exitEvent}) [${exitCode}]`);
      console.error(e);
    }

    process.nextTick(() => setTimeout(process.exit, 500));
  }
};

export const initProcess = async (processCode, initFn, afterInitFn = doNothing, afterCheckFn = doNothing) => {
  const processInfo = [];

  await initConfigs();

  masterConfig.processes.selectedProcess = processCode;
  masterConfig.args = argv;

  await initFn();

  _processCode = processCode;

  process.on('unhandledRejection', rejection => {
    console.error('Unhandled promise rejection');
    console.error(util.inspect(rejection));
  });

  //do something when app is closing
  process.on('exit', exitHandler('exit'));

  //catches ctrl+c event
  process.on('SIGINT', exitHandler('SIGINT'));

  // catches "kill pid" (for example: nodemon restart)
  process.on('SIGUSR1', exitHandler('SIGUSR1'));
  process.on('SIGUSR2', exitHandler('SIGUSR2'));

  const currentProcess = masterConfig.processes.getCurrentProcess();
  masterConfig.infrastructure.internalIp = await getInternalIp();

  processInfo.push(`Process: ${currentProcess.toString()}`);
  processInfo.push(`Internal IP: ${masterConfig.infrastructure.internalIp}`);

  console.info(`@foodjs/${_processCode} started\n${processInfo.map(pi => `\t${pi}\n`).join('')}`);

  await afterInitFn();

  afterCheckFn();
};
