import { Attribute, Qualifier, Relation, Thing } from "@food-js/core";
import { Concept } from "@food-js/core/concept";
import { ItemDefinitionInfo, Subject } from "@food-js/lib-core-dsl/define/subject/subject";
import { Queue } from "@food-js/lib-core-dsl/define/capture/queue";

export class Doing extends Subject<Relation, Thing> {

  constructor(target: Relation) {
    super(target)
  }

  how<T extends Concept>(attribute: Attribute, additionalInfo: ItemDefinitionInfo<T> = Qualifier.plain): this {
    return this.where(attribute, additionalInfo);
  }

  for<T extends Concept>(attribute: Attribute, additionalInfo: ItemDefinitionInfo<T> = Qualifier.plain): this {
    return this.where(attribute, additionalInfo);
  }

  resolve(queue: Queue<any>): Relation {
    return this.resolveSpawned(queue);
  }

  private resolveSpawned(queue: Queue<any>): Relation {
    return super.resolve(queue, 'spawn') as Relation;
  }

  toString() {
    return `~do:${this.toStringBase()}`;
  }

}
