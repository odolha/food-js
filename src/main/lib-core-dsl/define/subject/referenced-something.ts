import { Attribute, Concept, Qualifier, Thing } from "@food-js/core";
import { Something } from "@food-js/lib-core-dsl/define/subject/something";
import { Queue } from "@food-js/lib-core-dsl/define/capture/queue";
import { ItemDefinitionInfo } from "@food-js/lib-core-dsl/define/subject/subject";
import { AdjustedSomething } from "@food-js/lib-core-dsl/define/subject/adjusted-something";

export class ReferencedSomething extends Something {

  constructor(target: Thing) {
    super(target)
  }

  nowBeing<T extends Concept>(attribute: Attribute, additionalInfo: ItemDefinitionInfo<T> = Qualifier.plain): AdjustedSomething {
    return new AdjustedSomething(this).where(attribute, additionalInfo);
  }

  resolve(queue: Queue<Thing>, resolution = null): Thing {
    return this.resolveFound(queue);
  }

  private resolveFound(queue: Queue<Thing>): Thing {
    return super.resolve(queue, 'find');
  }

  toString() {
    return `~some-ref:${this.toStringBase()}`;
  }

}
