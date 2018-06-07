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

export const inside = attribute('inside');
export const putOn = attribute('putOn');
export const putIn = attribute('putIn');
export const having = attribute('having');
export const being = attribute('being');

export const $heavy = Symbol('heavy');
export const heavy = value($heavy);

export const grams = attribute('grams');
export const kgs = attribute('kgs');
export const liters = attribute('liters');
export const mls = attribute('mls');
export const seconds = attribute('seconds');
export const minutes = attribute('minutes');
export const hours = attribute('hours');

export const wait = production('wait');
