import { foodjs } from "@food-js/core/foodjs";

export const commonsUnit = foodjs.unit('@food-js/commons');
const { attribute, thing, value } = commonsUnit.make;

export const base = thing('base');

export const weightOf = attribute('weightOf');
export const volumeOf = attribute('volumeOf');
export const numberOf = attribute('numberOf');
export const timeOf = attribute('timeOf');

export const inside = attribute('inside');
export const putOn = attribute('putOn');
export const putIn = attribute('putIn');
export const having = attribute('having');
export const being = attribute('being');

export const heavy = value('heavy');

export const grams = attribute('grams');
export const kgs = attribute('kgs');
export const liters = attribute('liters');
export const mls = attribute('mls');
export const seconds = attribute('seconds');
export const minutes = attribute('minutes');
export const hours = attribute('hours');
