import { Something } from "./something";
import { Thing } from "../../../core";
import { Queue } from "@food-js/lib-core-dsl/define/capture/queue";

export class NewSomething extends Something {

  constructor(target: Thing) {
    super(target)
  }

  resolve(): Thing {
    return this.resolveSpawned();
  }

  private resolveSpawned(): Thing {
    return super.resolve(Queue.empty(), 'spawn');
  }

  toString() {
    return `~some-new:${this.toStringBase()}`;
  }

}
