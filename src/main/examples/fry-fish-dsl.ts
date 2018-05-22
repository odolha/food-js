import { foodjs } from "@food-js/core/foodjs";
import { filleted, fish, friedFish, fry, oil, pan, pepper, salt, stove } from "@food-js/library/food/common.concepts";
import { base, having, heavy } from "@food-js/library/commons/core.concepts";
import { simpleToString } from "@food-js/library/commons/simple-to-string.plugin";
import { numberUnitOfMeasurements } from "@food-js/library/core-dsl/number-unit-of-measurements.plugin";
import { define } from "@food-js/library/core-dsl/define.plugin";

simpleToString.load();
numberUnitOfMeasurements.load();
define.load();

// using the core-dsl to compose a similar complex structure easier than the canonical representation
export const fryFish = foodjs
  .unit('fry-fish-example')
  .define('fryFish')
  .as(({ requires, some, summary, taking, sequence }) => {
    // ingredients
    requires([ some(pan, [ having, [ base, [ heavy ] ] ]) ]);
    requires([ some(fish, filleted), oil, salt, pepper ]);

    // recipe summary
    summary(taking(fish).applying(fry).results(friedFish));

    // recipe details
    const prepPan = taking(pan).putOn(stove).add(oil).wait(5.0.minutes());
    const fryFish = taking(pan).add(fish).wait(10.0.minutes());

    return sequence(prepPan, fryFish);
  });
