import { foodjs } from "@food-js/core/foodjs";

const fryFishExample = foodjs.unit('@food-js/food');
const { production, thing, attribute } = fryFishExample.make;

export const food = thing('food');
export const tool = thing('tool');
export const salt = thing('salt').ofType(food);
export const pepper = thing('pepper').ofType(food);
export const oil = thing('oil').ofType(food);
export const fish = thing('fish').ofType(food);
export const pan = thing('pan').ofType(tool);
export const stove = thing('stove').ofType(tool);
export const fried = attribute('fried');
export const oily = attribute('oily');
export const seasoned = attribute('seasoned');
export const wait = production('wait');
export const heat = production('heat');
export const fry = production('fry');
export const filleted = attribute('filleted');
export const friedFish = fish.withAttribute(fried).withSynonym(thing('friedFish'));
