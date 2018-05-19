// food-lib
import { attribute, production, thing } from "@food-js/core";
import { base, having, heavy } from "@food-js/library/commons";
import { define } from "@food-js/library/core-dsl";

const food = thing('food');
const tool = thing('tool');
const salt = thing('salt').ofType(food);
const pepper = thing('pepper').ofType(food);
const oil = thing('oil').ofType(food);
const fish = thing('fish').ofType(food);
const pan = thing('pan').ofType(tool);
const stove = thing('stove').ofType(tool);
const fried = attribute('fried');
const oily = attribute('oily');
const seasoned = attribute('seasoned');
const fry = production('fry');
const filleted = attribute('filleted');
const friedFish = fish.withAttribute(fried).withSynonym(thing('friedFish'));

// using the core-dsl to compose a similar complex structure easier than the canonical representation
export const fryFish = define('fryFish', ({ requires, a, some, taking, sequence }) => {
  // ingredients
  requires([ a(pan, [ having, [ base, [ heavy ] ] ]) ]);
  requires([ some(fish, filleted), oil, salt, pepper ]);

  // recipe summary
  const summary = taking(fish).apply(fry).results(friedFish);

  // recipe details
  const prepPan = taking(pan).putOn(stove).add(oil).wait(5.0.minutes);
  const fryFish = taking(pan).add(fish).wait(10.0.minutes);

  return sequence(prepPan, fryFish);
});
