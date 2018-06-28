import { Attribute, Qualifier, Relation, Thing } from "@food-js/core";
import { Concept } from "@food-js/core/concept";
import { ItemDefinitionInfo, Subject } from "@food-js/lib-core-dsl/define/subject/subject";

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

  toString() {
    return `~do:${this.toStringBase()}`;
  }

}
