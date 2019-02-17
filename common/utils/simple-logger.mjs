import { stringify } from '../utils/stringify.mjs';

export class SimpleLogger {
  doLog(type, lev, text, ...args) {
    let logText = `${lev.toUpperCase()} ${text}`;
    if (args.length > 0) {
      logText = logText + ' | ' + args.map(a => stringify(a)).join(', ');
    }
    console[type](logText);
  }
  silly(text, ...args) {
    this.doLog('log', 'silly', text, ...args);
  }
  debug(text, ...args) {
    this.doLog('log', 'debug', text, ...args);
  }
  verbose(text, ...args) {
    this.doLog('log', 'verbose', text, ...args);
  }
  info(text, ...args) {
    this.doLog('info', 'info', text, ...args);
  }
  caution(text, ...args) {
    this.doLog('caution', 'caution', text, ...args);
  }
  cautionStack(text, ...args) {
    this.doLog('caution', 'caution', text, ...args);
    this.doLog('caution', 'caution', new Error().stack)
  }
  warn(text, ...args) {
    this.doLog('warn', 'warn', text, ...args);
  }
  warnStack(text, ...args) {
    this.doLog('warn', 'warn', text, ...args);
    this.doLog('warn', 'warn', new Error().stack)
  }
  error(text, ...args) {
    this.doLog('error', 'error', text, ...args);
  }
  errorStack(text, ...args) {
    this.doLog('error', 'error', text, ...args);
    this.doLog('error', 'error', new Error().stack)
  }
}

export const blankLogger = new class BlankLogger {
  silly() { }
  debug() { }
  verbose() { }
  info() { }
  warn() { }
  error() { }
  errorStack() { }
};
