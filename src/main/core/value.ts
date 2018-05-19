import { Concept } from "./concept";
import { Qualifier } from "./qualifier";
import { $nothing, $quantity } from "./symbols";

export class Value<T extends Concept> extends Qualifier<T> {
  public readonly conceptType = $quantity;

  public value: number | string | symbol = $nothing;

  clone(): this {
    return new Value(this.code) as this;
  }
  withValue(value: number | string | symbol) {
    return this.derivated({ value });
  }
}
