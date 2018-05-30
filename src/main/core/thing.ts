import { Qualifier } from "./qualifier";
import { $nothing, $thing } from "./symbols";
import { Concept } from "@food-js/core/concept";

export class Thing extends Qualifier<Thing> {
  static nothing = new Thing($nothing);

  public readonly conceptType = $thing;

  public get list(): Concept[] {
    if (this.isNothing()) {
      return [];
    } else {
      return [ this ];
    }
  }

  isNothing() {
    return this.code === $nothing;
  }

  clone(): this {
    return new Thing(this.code) as this;
  }
}
