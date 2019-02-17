import { Container } from "../../common/container.mjs";
import { SimpleLogger } from "../../common/utils/simple-logger.mjs";

export const beContainer = new Container('be');
beContainer.register('logger', new SimpleLogger());

export const linkAll = beContainer.linkAll.bind(beContainer);
export const register = beContainer.register.bind(beContainer);
export const obtain = beContainer.obtain.bind(beContainer);
