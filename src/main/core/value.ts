import { Concept } from "./concept";
import { Qualifier } from "./qualifier";
import { $nil, $value } from "./symbols";

export type AcceptedValueType = number | string | symbol;

export class Value<T extends Concept> extends Qualifier<T> {
  public readonly conceptType = $value;

  public value: number | string | symbol = $nil;

  clone(): this {
    return new Value(this.code) as this;
  }
  withValue(value: AcceptedValueType) {
    return this.derivated({ value });
  }

}
