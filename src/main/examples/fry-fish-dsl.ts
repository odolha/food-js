import { foodjs } from "@food-js/core/foodjs";
import {
  filleted,
  fish, fried,
  friedFish,
  fry,
  heat,
  heated,
  oil, oily,
  pan,
  pepper,
  salt, season, seasoned,
  stove
} from "@food-js/lib-food/common.concepts";
import { base, by, having, heavy, inside, on, put, weightOf } from "@food-js/lib-commons/core.concepts";
import { simpleToString } from "@food-js/lib-commons/simple-to-string.plugin";
import { ProductionExample } from "@food-js/examples/example";
import { numberUnitOfMeasurements } from "@food-js/lib-core-dsl/number-enhancements/number-enhancements.plugin";
import { define } from "@food-js/lib-core-dsl/define/define.plugin";


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

// using the lib-core-dsl to compose a similar complex structure easier than the basic representation
const fryFish = () => foodjs
  .unit('fry-fish-example')
  .define('fryFish')
  .as(({ requires, a, some, summary, taking, the, action, all }) => {
    // prerequisites
    requires(a(stove));
    requires(a(pan).where(having, a(base).with(weightOf, heavy)));
    requires(
      some(fish).being(filleted),
      some(oil), some(salt), some(pepper)
    );

    // recipe summary
    summary(taking(the(fish)).perform(action(fry)).toObtain(friedFish));

    // recipe steps
    const prepPan = all(
      taking(the(pan))
        .perform(action(put).how(on, the(stove)))
        .toObtain(the(pan).nowBeing(on, the(stove))),

      taking(the(oil))
        .perform(action(put).how(inside, the(pan)))
        .toObtain(the(oil).nowBeing(inside, the(pan))),

      taking(the(pan))
        .perform(action(heat).for(5['minutes']))
        .toObtain(the(pan).nowBeing(heated).and(oily))
    );

    const seasonFish = taking(the(fish))
      .perform(action(season).how(by, [salt, pepper]))
      .toObtain(the(fish).nowBeing(seasoned, [salt, pepper]));

    const fryFish = all(
      taking(the(fish))
        .perform(action(put).how(inside, the(pan)))
        .toObtain(the(fish).nowBeing(inside, the(pan))),

      taking(the(fish))
        .perform(action(fry).for(10['minutes']))
        .toObtain(the(fish).nowBeing(fried))
    );

    // recipe build
    return prepPan.then(seasonFish).then(fryFish);
  })
  .build();

export const example: ProductionExample = { productionExample: fryFish, productionSetUp, productionTearDown };
