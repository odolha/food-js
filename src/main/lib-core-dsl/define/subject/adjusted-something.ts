import { Thing } from "@food-js/core";
import { Something } from "@food-js/lib-core-dsl/define/subject/something";
import { Queue } from "@food-js/lib-core-dsl/define/capture/queue";
import { ReferencedSomething } from "@food-js/lib-core-dsl/define/subject/referenced-something";

export class AdjustedSomething extends Something {

  constructor(private ref: ReferencedSomething) {
    super(null); // target will be resolved dynamically via ref
  }

  resolve(queue: Queue<Thing>): Thing {
    this.target = this.ref.resolve(queue);
    return super.resolve(queue, 'spawn');
  }

  toString() {
    return `~some-adj:${this.toStringBase()}`;
  }

}
