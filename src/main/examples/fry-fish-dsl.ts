import { FoodJs, foodjs } from "@food-js/core/foodjs";
import {
  filleted,
  fish,
  friedFish,
  fry,
  heat,
  oil,
  pan,
  pepper,
  salt,
  stove
} from "@food-js/library/food/common.concepts";
import { base, having, heavy, putIn, putOn, typeOf, weightOf } from "@food-js/library/commons/core.concepts";
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
const fryFish = () => foodjs
  .unit('fry-fish-example')
  .define('fryFish')
  .as(({ requires, a, some, summary, taking, the, sequence, perform }) => {
    // prerequisites
    requires([ a(pan).where(having, a(base).with(weightOf, heavy)) ]);
    requires([ some(fish).being(filleted), oil, salt, pepper ]);

    // recipe summary
    summary(taking(fish).apply(fry).yields(friedFish));

    // recipe details
    const prepPan = sequence(
      taking(pan).adjust(putOn, the(stove)),
      taking(oil).adjust(putIn, the(pan)),
      perform(heat).for(5['minutes'])
    );

    const fryFish = sequence(
      taking(fish).adjust(putIn, pan),
      perform(fry).for(10['minutes'])
    );

    return sequence(prepPan, fryFish);
  })
  .build();

export const example: ProductionExample = { productionExample: fryFish, productionSetUp, productionTearDown };
