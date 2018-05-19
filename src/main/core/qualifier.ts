import { Concept } from "./concept";
import { $plain, $qualifier } from "./symbols";

export class Qualifier<T extends Concept> extends Concept {
  static plain = new Qualifier($plain);

  public readonly conceptType = $qualifier;

  clone(): this {
    return new Qualifier<T>(this.code) as this;
  }
  isPlain() {
    return this.code === $plain;
  }
}