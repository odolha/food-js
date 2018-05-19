import { Qualifier } from "./qualifier";
import { $thing } from "./symbols";

export class Thing extends Qualifier<Thing> {
  public readonly conceptType = $thing;

  clone(): this {
    return new Thing(this.code) as this;
  }
}
