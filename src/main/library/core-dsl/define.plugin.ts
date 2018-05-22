import { FoodJs, foodjs } from "@food-js/core/foodjs";
import { Relation } from "@food-js/core";

export const coreDslUnit = foodjs.unit('@food-js/core-dsl');
const { plugin } = coreDslUnit.functions;

export interface DefUtils {
  requires,
  some,
  summary,
  taking,
  sequence
}

type DefBuilderFunction = (utils: DefUtils) => Relation;

class DefBuilder {
  constructor(private code: string, private fn: DefBuilderFunction) { }

  build(): Relation {
    // XXX
    return null;
  }
}

class DefBuilderPartial1 {
  constructor(public code: string) { }
  as(fn: DefBuilderFunction): Relation {
    return new DefBuilder(this.code, fn).build();
  }
}

declare module '@food-js/core/foodjs' {
  interface FoodJs {
    define(code: string): DefBuilderPartial1;
  }
}

export const define = plugin('define', {
  globalExtensions: [
    {
      type: FoodJs,
      method: 'define',
      implementation: () => (productionCode: string) => new DefBuilderPartial1(productionCode)
    }
  ]});
