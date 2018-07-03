import '../../test-util';
import { fish, friedFish, fry } from "@food-js/lib-food/common.concepts";
import * as assert from "assert";
import { simpleToString } from "@food-js/lib-commons/simple-to-string.plugin";
import { simpleEquals } from "@food-js/lib-commons/simple-equals.plugin";
import { Doing } from "@food-js/lib-core-dsl/define/subject/doing";
import { Queue } from "@food-js/lib-core-dsl/define/capture/queue";

describe('Doing', () => {

  beforeEach(() => {
    simpleToString.load();
    simpleEquals.load();
  });

  afterEach(() => {
    simpleToString.unload();
    simpleEquals.unload();
  });

  it('.resolve() should always create a new relation', () => {
    const rel = fry.withInput(fish).withOutput(friedFish);
    const doing = new Doing(rel);
    const res = doing.resolve(Queue.empty());
    assert(res.equals(rel));
  });

});
