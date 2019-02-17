import { Container } from "../../common/container.mjs";

const container = new Container('ui');

export const linkAll = container.linkAll.bind(container);
export const register = container.register.bind(container);
export const obtain = container.obtain.bind(container);
