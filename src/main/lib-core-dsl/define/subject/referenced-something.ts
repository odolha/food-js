import { Thing } from "@food-js/core";
import { Something } from "@food-js/lib-core-dsl/define/subject/something";
import { Queue } from "@food-js/lib-core-dsl/define/capture/queue";

export class ReferencedSomething extends Something {

  constructor(target: Thing) {
    super(target)
  }

  resolve(queue: Queue<Thing>): Thing {
    return this.resolveFound(queue);
  }

  private resolveFound(queue: Queue<Thing>): Thing {
    return super.resolve(queue, 'find');
  }

  toString() {
    return `~some-ref:${this.toStringBase()}`;
  }

}
