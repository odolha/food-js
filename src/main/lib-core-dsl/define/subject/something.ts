import { Attribute, Qualifier, Thing } from "@food-js/core";
import { Concept } from "@food-js/core/concept";
import { ItemDefinitionInfo, Subject } from "@food-js/lib-core-dsl/define/subject/subject";

export abstract class Something extends Subject<Thing> {

  protected constructor(target: Thing) {
    super(target);
  }

  with<T extends Concept>(attribute: Attribute, additionalInfo: ItemDefinitionInfo<T> = Qualifier.plain): this {
    return this.where(attribute, additionalInfo);
  }

  being<T extends Concept>(attribute: Attribute, additionalInfo: ItemDefinitionInfo<T> = Qualifier.plain): this {
    return this.where(attribute, additionalInfo);
  }

}
