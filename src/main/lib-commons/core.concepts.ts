import { foodjs } from "@food-js/core/foodjs";

export const commonsUnit = foodjs.unit('@lib-food-js/lib-commons');
const { attribute, thing, value, production } = commonsUnit.make;

export const tagged = attribute('tagged');
export const summarized = attribute('summarized');

export const base = thing('base');

export const weightOf = attribute('weightOf');
export const volumeOf = attribute('volumeOf');
export const numberOf = attribute('numberOf');
export const timeOf = attribute('timeOf');
export const typeOf = attribute('typeOf');

export const by = attribute('by');
export const having = attribute('having');
export const being = attribute('being');
export const inside = attribute('inside');
export const on = attribute('on');

export const heavy = value(Symbol('heavy'));
export const light = value(Symbol('light'));

export const grams = attribute('grams');
export const kgs = attribute('kgs');
export const liters = attribute('liters');
export const mls = attribute('mls');
export const seconds = attribute('seconds');
export const minutes = attribute('minutes');
export const hours = attribute('hours');

export const put = production('put');
export const wait = production('wait');
