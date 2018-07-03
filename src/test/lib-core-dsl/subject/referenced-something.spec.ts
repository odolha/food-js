import '../../test-util';
import { fish, friedFish, meat } from "@food-js/lib-food/common.concepts";
import * as assert from "assert";
import { simpleToString } from "@food-js/lib-commons/simple-to-string.plugin";
import { simpleEquals } from "@food-js/lib-commons/simple-equals.plugin";
import { ReferencedSomething } from "@food-js/lib-core-dsl/define/subject/referenced-something";
import { Thing } from "@food-js/core";
import { Queue } from "@food-js/lib-core-dsl/define/capture/queue";

describe('ReferencedSomething', () => {

  beforeEach(() => {
    simpleToString.load();
    simpleEquals.load();
  });

  afterEach(() => {
    simpleToString.unload();
    simpleEquals.unload();
  });

  it('.resolve() should throw exception when not finding item', () => {
    const something = new ReferencedSomething(fish);
    assert.throws(() => something.resolve(new Queue<Thing>()));
  });

  it('.resolve() should find an item', () => {
    const something = new ReferencedSomething(fish);
    const res = something.resolve(new Queue<Thing>([meat, fish]));
    assert(res.equals(fish));
  });

  it('.resolve() should find the last matching item added in queue', () => {
    const something = new ReferencedSomething(fish);
    const res = something.resolve(new Queue<Thing>([meat, fish, friedFish]));
    assert(res.equals(friedFish));
  });

});
