// food-lib
import { base, having, heavy } from "@food-js/library/commons";
import { define } from "@food-js/library/core-dsl";
import { foodjs } from "@food-js/core";
import { filleted, fish, friedFish, fry, oil, pan, pepper, salt, stove } from "@food-js/library/food";

const fryFishExample = foodjs.unit('fry-fish-example');
const { production, thing, attribute } = fryFishExample.functions;

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
