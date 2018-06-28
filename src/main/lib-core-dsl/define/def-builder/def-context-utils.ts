import { Relation, Thing } from "@food-js/core";
import { Capture } from "@food-js/lib-core-dsl/define/capture/capture";
import { Doing } from "@food-js/lib-core-dsl/define/subject/doing";
import { DefContext } from "@food-js/lib-core-dsl/define/def-builder/def-context";
import { NewSomething } from "@food-js/lib-core-dsl/define/subject/new-something";
import { ReferencedSomething } from "@food-js/lib-core-dsl/define/subject/referenced-something";

export interface DefContextUtils {

  requires(...requirements: NewSomething[]): void;
  summary(capture: Capture): void;
  taking(subject: ReferencedSomething): Capture;
  the(target: Thing): ReferencedSomething;
  some(target: Thing): NewSomething;
  a(target: Thing): NewSomething;
  action(relation: Relation): Doing;
  all(...captures: Capture[]): Capture;

}

export function makeContextUtils(context: DefContext): DefContextUtils {
  return {
    requires: context.requires.bind(context),
    some: context.some.bind(context),
    a: context.a.bind(context),
    summary: context.summary.bind(context),
    taking: context.taking.bind(context),
    the: context.the.bind(context),
    action: context.action.bind(context),
    all: context.all.bind(context)
  };
}
