import '../../test-util';
import { fish, fried, friedFish } from "@food-js/lib-food/common.concepts";
import { NewSomething } from "@food-js/lib-core-dsl/define/subject/new-something";
import * as assert from "assert";
import { simpleToString } from "@food-js/lib-commons/simple-to-string.plugin";
import { simpleEquals } from "@food-js/lib-commons/simple-equals.plugin";

describe('NewSomething', () => {

  beforeEach(() => {
    simpleToString.load();
    simpleEquals.load();
  });

  afterEach(() => {
    simpleToString.unload();
    simpleEquals.unload();
  });

  it('.resolve() should spawn an item simply as given', () => {
    const something = new NewSomething(fish);
    const item = something.resolve();
    assert(!!item);
    assert(item === fish);
  });

  it('.resolve() should spawn an item and derivate with decorators', () => {
    const something = new NewSomething(fish).where(fried);
    const item = something.resolve();
    assert(!!item);
    assert(item !== fish);
    assert(item !== friedFish);
    assert(item.equals(friedFish));
  });

});
