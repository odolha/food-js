import '../test-util';
import * as assert from "assert";
import { Attribute, Thing } from "@food-js/core";
import { simpleEquals } from "@food-js/lib-commons/simple-equals.plugin";

describe('Concept', () => {

  beforeEach(() => {
    simpleEquals.load();
  });

  afterEach(() => {
    simpleEquals.unload();
  });

  it('.equals() works on simple Things', () => {
    const $fish = Symbol('fish');
    assert(new Thing($fish).equals(new Thing($fish)));
    assert(!new Thing('fish').equals(new Thing('fish')));
    assert(!new Thing('fish').equals(new Thing('fish2')));
    assert(!new Thing('fish').equals(new Attribute('fish')));
    assert(!new Thing($fish).equals(new Attribute($fish)));
    assert(!new Thing('fish').equals(new Thing('fish').withAttribute(new Attribute('something'))));
    assert(!new Thing($fish).equals(new Thing($fish).withAttribute(new Attribute('something'))));
  });

});
