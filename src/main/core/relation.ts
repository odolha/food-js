import { $relation } from "./symbols";
import { Thing } from "./thing";
import { Group } from "@food-js/core";

export class Relation extends Thing {
  public readonly conceptType = $relation;

  public input: Thing = Thing.nothing;
  public output: Thing = Thing.nothing;

  clone(): this {
    return new Relation(this.code) as this;
  }
  withInput(input: Thing): this {
    return this.derivated({ input });
  }
  withMergedInput(newInput: Thing) {
    if (this.input.isNothing()) {
      return this.withInput(newInput);
    } else {
      return this.withInput(new Group().withItems(newInput, this.input));
    }
  }
  withOutput(output: Thing): this {
    return this.derivated({ output });
  }
}
