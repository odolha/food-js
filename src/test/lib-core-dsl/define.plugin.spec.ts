import '../test-util';
import { foodjs } from "@food-js/core/foodjs";
import { simpleToString } from "@food-js/lib-commons/simple-to-string.plugin";
import { numberUnitOfMeasurements } from "@food-js/lib-core-dsl/number-enhancements.plugin";
import { define } from "@food-js/lib-core-dsl/define.plugin";
import { fish, friedFish, fry } from "@food-js/lib-food/common.concepts";
import * as assert from "assert";

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

  it('allows simple taking-perform-toObtain syntax', () => {
    const recipe = foodjs
      .unit('tests')
      .define('recipe')
      .as(({ taking, some, action }) => {
        return taking(some(fish)).perform(action(fry)).toObtain(some(friedFish));
      })
      .build();

    assert.equal(recipe.toString(), 'fish *fry[@tagged:=recipe]* fish[@fried]');
  });

});
