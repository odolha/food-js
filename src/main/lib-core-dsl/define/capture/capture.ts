// TODO: split in 3 steps to force correct definition
import { Relation, Thing } from "@food-js/core";
import { FoodJSMaker } from "@food-js/core/foodjs";
import { Something } from "@food-js/lib-core-dsl/define/subject/something";
import { Doing } from "@food-js/lib-core-dsl/define/subject/doing";
import { Queue } from "@food-js/lib-core-dsl/define/capture/queue";
import { NewSomething } from "@food-js/lib-core-dsl/define/subject/new-something";
import { AdjustedSomething } from "@food-js/lib-core-dsl/define/subject/adjusted-something";

export class Capture {
  private target: Something;
  private application: Doing;
  private result: AdjustedSomething | NewSomething | Thing;
  private next: Capture;

  constructor(subject: Something) {
    this.taking(subject);
  }

  taking(subject: Something): this {
    this.target = subject;
    return this;
  }

  perform(subject: Doing): this {
    this.application = subject;
    return this;
  }

  toObtain(result: AdjustedSomething | NewSomething | Thing): this {
    this.result = result;
    return this;
  }

  then(next: Capture): this {
    // allow flat usage of then to create link
    if (this.next) {
      this.next.then(next);
    } else {
      this.next = next;
    }
    return this;
  }

  resolve(queue: Queue<Thing> = Queue.empty(), make: FoodJSMaker): Relation {
    if (this.target && this.application && this.result) {
      const resolvedTarget = this.target.resolve(queue);
      queue = queue.adding(resolvedTarget);
      const resolvedApplication = this.application.resolve(queue) as Relation;
      const resolvedResult = this.result instanceof Thing
        ? this.result
        : this.result instanceof NewSomething
          ? this.result.resolve()
          : this.result.resolve(queue);
      const resolvedRelation = resolvedApplication.withInput(resolvedTarget).withOutput(resolvedResult);
      if (this.next) {
        queue = queue.adding(resolvedRelation);
        return this.next.resolve(queue, make).withMergedInput(resolvedRelation);
      } else {
        return resolvedRelation;
      }
    } else {
      throw new Error('Capture must always define target, application and result');
    }
  }

  toString() {
    return `${this.target.toString()} do ${this.application.toString()} yields ${this.result.toString()}`;
  }

}