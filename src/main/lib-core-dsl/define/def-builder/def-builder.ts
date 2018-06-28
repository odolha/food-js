import { FoodJs, FoodJSMaker } from "@food-js/core/foodjs";
import { summarized, tagged } from "@food-js/lib-commons/core.concepts";
import { Relation } from "@food-js/core";
import { DefContextUtils, makeContextUtils } from "@food-js/lib-core-dsl/define/def-builder/def-context-utils";
import { Capture } from "@food-js/lib-core-dsl/define/capture/capture";
import { DefContext } from "@food-js/lib-core-dsl/define/def-builder/def-context";

export type DefBuilderFunction = (utils: DefContextUtils) => Capture;

export class DefBuilder {

  make: FoodJSMaker;
  context: DefContext;

  constructor(private foodjs: FoodJs, private tag: string, private fn: DefBuilderFunction) {
    this.make = foodjs.make;
    this.context = new DefContext(this.make);
  }

  build(): Relation {
    const rootCapture = this.fn(makeContextUtils(this.context));
    const { summary, main } = this.context.buildAll(rootCapture);
    const summaryProduction = summary ? summary.withAttribute(summarized) : null;
    const mainProduction = main.withAttribute(tagged.withQualifier(this.make.value(this.tag)));
    return summaryProduction ? mainProduction.withSynonym(summaryProduction) : mainProduction;
  }

}

export class DefBuilderPartial {

  constructor(public foodjs: FoodJs, public code: string) { }

  as(fn: DefBuilderFunction): DefBuilder {
    return new DefBuilder(this.foodjs, this.code, fn);
  }

}
