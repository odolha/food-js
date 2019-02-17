import { isArray } from "./utils/types.mjs";
import { existing } from "./utils/predicate.mjs";

const containers = [];

const $link = Symbol('$link');

const info = msg => {
  const logger = containers.map(c => c._doObtain('logger')).filter(existing)[0];
  if (logger) {
    logger.instance.info(msg);
  } else {
    console.info(msg);
  }
};

const warn = msg => {
  const logger = containers.map(c => c._doObtain('logger')).filter(existing)[0];
  if (logger) {
    logger.instance.warn(msg);
  } else {
    console.warn(msg);
  }
};

const error = msg => {
  const logger = containers.map(c => c._doObtain('logger')).filter(existing)[0];
  if (logger) {
    logger.instance.errorStack(msg);
  } else {
    console.error(msg);
  }
};

export class Container {

  constructor(code) {
    this.code = code;
    this.registry = [];
    containers.push(this);
    Container.principal = Container.principal || this;
  }

  _doObtain(key) {
    return this.registry.find(({ key: keyInReg }) => keyInReg === key);
  }

  has(keyOrInstance) {
    return this.registry.some(({ key, instance }) => keyOrInstance === key || instance === keyOrInstance);
  }

  obtain(key) {
    const item = this._doObtain(key);
    if (item) {
      return item.instance;
    } else {
      error(`Cannot find instance in container '${this.code}' for '${key.name || key.toString()}'`);
    }
  };

  register(keyOrKeys, instance) {
    const keys = isArray(keyOrKeys) ? keyOrKeys : [ keyOrKeys ];
    keys.forEach(key => {
      const previous = this._doObtain(key);
      if (previous) {
        warn(`Replacing previous instance in container '${this.code}' for '${key.name || key.toString()}'`);
        this.registry.splice(this.registry.indexOf(previous), 1);
      }
      this.registry.push({ key, instance });
      info(`Registered new instance in container '${this.code}' for '${key.name || key.toString()}'`);
    });
    return instance;
  };

  linkAll() {
    const linkFn = key => this.obtain(key);
    this.registry.filter(item => item.instance[$link]).forEach(item => item.instance[$link](linkFn));
  }

}

Container.for = instance => {
  return containers.find(c => c.has(instance)) || Container.principal;
};

Container.obtain = key => {
  const found = containers.map(c => c._doObtain(key)).filter(existing);
  if (found.length === 1) {
    return found[0].instance;
  } else if (found.length === 0) {
    error(`Cannot find instance in any container for '${key.name || key.toString()}'`);
  } else {
    error(`Multiple containers contain instance for '${key.name || key.toString()}'`);
  }
};

Container.$link = $link;
