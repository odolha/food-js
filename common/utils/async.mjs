export const promiseTimeout = (timeout, response) => new Promise(resolve => setTimeout(() => resolve(response), timeout));

export const setTimeoutWithPromise = (fn, timeout) => new Promise(resolve => setTimeout(() => { fn(); resolve(); }, timeout));

export const $timedOut = Symbol();

export const withTimeout = async (timeout, fn) => {
  const promise = fn();
  return await Promise.race([ promise, promiseTimeout(timeout, $timedOut) ]);
};
