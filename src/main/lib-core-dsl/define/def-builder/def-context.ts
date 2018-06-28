import { Relation, Thing } from "@food-js/core";
import { FoodJSMaker } from "@food-js/core/foodjs";
import { DefContextUtils } from "@food-js/lib-core-dsl/define/def-builder/def-context-utils";
import { Capture } from "@food-js/lib-core-dsl/define/capture/capture";
import { Doing } from "@food-js/lib-core-dsl/define/subject/doing";
import { Queue } from "@food-js/lib-core-dsl/define/capture/queue";
import { NewSomething } from "@food-js/lib-core-dsl/define/subject/new-something";
import { ReferencedSomething } from "@food-js/lib-core-dsl/define/subject/referenced-something";

export class DefContext implements DefContextUtils {

  private requirements: Queue<NewSomething> = Queue.empty();
  private summaryCapture: Capture;

  constructor(private make: FoodJSMaker) { }

  requires(...newRequirements: NewSomething[]): void {
    this.requirements = this.requirements.adding(...newRequirements);
  }

  summary(capture: Capture): void {
    this.summaryCapture = capture;
  }

  some(target: Thing): NewSomething {
    return new NewSomething(target);
  }

  a(target: Thing): NewSomething {
    return this.some(target);
  }

  taking(subject: ReferencedSomething): Capture {
    return new Capture(subject);
  }

  the(target: Thing): ReferencedSomething {
    return new ReferencedSomething(target);
  }

  action(relation: Relation): Doing {
    return new Doing(relation);
  }

  all(...captures: Capture[]) {
    return captures.reduce((res, cap) => res ? res.then(cap) : cap);
  }

  resolveRequirements(): Queue<Thing> {
    return this.requirements.map(req => req.resolve());
  }

  buildSummary(reqs: Queue<Thing>): Relation {
    // TODO: verify end result to yield a relation
    return this.summaryCapture.resolve(reqs, this.make) as Relation;
  }

  buildMain(root: Capture, reqs: Queue<Thing>): Relation {
    // TODO: verify end result to yield a relation
    return root.resolve(reqs, this.make) as Relation;
  }

  buildAll(rootCapture: Capture): { summary: Relation, main: Relation } {
    const resolvedRequirements = this.resolveRequirements();
    return {
      summary: this.summaryCapture ? this.buildSummary(resolvedRequirements) : null,
      main: this.buildMain(rootCapture, resolvedRequirements)
    };
  }

  toString() {
    return `Requirements: ${this.requirements.toString()}\nSummary: ${this.summaryCapture.toString()}`;
  }

}
