import { FoodJs, foodjs } from "@food-js/core/foodjs";
import { DefBuilderPartial } from "@food-js/lib-core-dsl/define/def-builder/def-builder";

export const coreDslUnit = foodjs.unit('@lib-food-js/lib-core-dsl');
const { plugin } = coreDslUnit.make;

declare module '@food-js/core/foodjs' {
  interface FoodJs {
    define(code: string): DefBuilderPartial;
  }
}

export const define = plugin('define', {
  globalExtensions: [
    {
      type: FoodJs,
      method: 'define',
      implementation: (self: any, productionCode: string) => new DefBuilderPartial(self, productionCode)
    }
  ]});
