import { foodjs } from "@food-js/core/foodjs";
import { filleted, fish, friedFish, fry, oil, pan, pepper, salt, stove } from "@food-js/library/food/common.concepts";
import { base, having, heavy, putIn, putOn } from "@food-js/library/commons/core.concepts";
import { simpleToString } from "@food-js/library/commons/simple-to-string.plugin";
import { numberUnitOfMeasurements } from "@food-js/library/core-dsl/number-enhancements.plugin";
import { define } from "@food-js/library/core-dsl/define.plugin";
import { ProductionExample } from "@food-js/examples/example";


const productionSetUp = () => {
  simpleToString.load();
  numberUnitOfMeasurements.load();
  define.load();
};
const productionTearDown = () => {
  simpleToString.unload();
  numberUnitOfMeasurements.unload();
  define.unload();
};

// using the core-dsl to compose a similar complex structure easier than the canonical representation
const fryFish = foodjs
  .unit('fry-fish-example')
  .define('fryFish')
  .as(({ requires, some, summary, taking, sequence, wait }) => {
    // prerequisites
    requires([ some(pan, [ having, [ base, [ heavy ] ] ]) ]);
    requires([ some(fish, filleted), oil, salt, pepper ]);

    // recipe summary
    summary(taking(fish).apply(fry).yields(friedFish));

    // recipe details
    const prepPan = sequence(
      taking(pan).adjust(putOn, stove),
      taking(oil).adjust(putIn, pan),
      wait(5['minutes'])
    );

    const fryFish = sequence(
      taking(fish).adjust(putIn, pan),
      wait(10['minutes'])
    );

    return sequence(prepPan, fryFish);
  })
  .build();

export const example: ProductionExample = { productionExample: fryFish, productionSetUp, productionTearDown };
