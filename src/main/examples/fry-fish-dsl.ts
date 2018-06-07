import { foodjs } from "@food-js/core/foodjs";
import {
  filleted,
  fish,
  friedFish,
  fry,
  heat,
  heated,
  oil, oily,
  pan,
  pepper,
  salt,
  stove
} from "@food-js/lib-food/common.concepts";
import { base, having, heavy, putIn, putOn, weightOf } from "@food-js/lib-commons/core.concepts";
import { simpleToString } from "@food-js/lib-commons/simple-to-string.plugin";
import { numberUnitOfMeasurements } from "@food-js/lib-core-dsl/number-enhancements.plugin";
import { define } from "@food-js/lib-core-dsl/define.plugin";
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

// using the lib-core-dsl to compose a similar complex structure easier than the canonical representation
const fryFish = () => foodjs
  .unit('fry-fish-example')
  .define('fryFish')
  .as(({ requires, a, some, summary, taking, the }) => {
    // prerequisites
    requires([ a(pan).where(having, a(base).with(weightOf, heavy)) ]);
    requires([ some(fish).being(filleted), some(oil), some(salt), some(pepper) ]);

    // recipe summary
    summary(taking(the(fish)).perform(fry).toObtain(the(friedFish)));

    const prepPan = taking(the(pan))
      .adjust(putOn, the(stove))
      .taking(the(oil))
      .adjust(putIn, the(pan))
      .perform(heat)
      .for(5['minutes'])
      .toObtain(the(pan).being(heated).being(oily));

    const fryFish = taking(the(fish))
      .adjust(putIn, pan)
      .perform(fry)
      .for(10['minutes'])
      .toObtain(some(friedFish));

    return prepPan.then(fryFish);
  })
  .build();

export const example: ProductionExample = { productionExample: fryFish, productionSetUp, productionTearDown };
