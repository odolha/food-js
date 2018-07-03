import { Concept } from "./concept";
import { Qualifier } from "./qualifier";
import { $attribute } from "./symbols";

export class Attribute extends Qualifier<Attribute> {
  public readonly conceptType = $attribute;

  public qualifier: Qualifier<Concept> = Qualifier.plain;

  clone(): this {
    return new Attribute(this.code) as this;
  }
  withQualifier(qualifier: Qualifier<Concept>): this {
    return this.derivated({ qualifier });
  }

}
