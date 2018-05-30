import { $relation } from "./symbols";
import { Thing } from "./thing";

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
  withOutput(output: Thing): this {
    return this.derivated({ output });
  }
}
