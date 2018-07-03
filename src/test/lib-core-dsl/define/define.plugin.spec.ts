import '../../test-util';
import { foodjs } from "@food-js/core/foodjs";
import { simpleToString } from "@food-js/lib-commons/simple-to-string.plugin";
import { fish, friedFish, fry } from "@food-js/lib-food/common.concepts";
import * as assert from "assert";
import { numberUnitOfMeasurements } from "@food-js/lib-core-dsl/number-enhancements/number-enhancements.plugin";
import { define } from "@food-js/lib-core-dsl/define/define.plugin";

describe('Plugin: define', () => {
  beforeEach(() => {
    simpleToString.load();
    numberUnitOfMeasurements.load();
    define.load();
  });

  afterEach(() => {
    simpleToString.unload();
    numberUnitOfMeasurements.unload();
    define.unload();
  });

  it('allows simple requires-taking-perform-toObtain syntax', () => {
    const recipe = foodjs.unit('tests').define('recipe')
      .as(({ requires, taking, the, some, action }) => {
        requires(some(fish));
        return taking(the(fish)).perform(action(fry)).toObtain(some(friedFish));
      })
      .build();

    assert.equal(recipe.toString(), 'fish *fry[@tagged:=recipe]* fish[@fried]');
  });
});
