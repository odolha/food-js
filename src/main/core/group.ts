import { Collectible } from "./collectible";
import { $group, $empty } from "./symbols";
import { Thing } from "./thing";

export class Group<T extends Thing> extends Thing implements Collectible<T> {
  static empty = new Group($empty);

  public readonly conceptType = $group;

  public items: T[] = [];

  public get list(): T[] {
    return this.items;
  }

  clone(): this {
    return new Group(this.code) as this;
  }
  withItems(...items: T[]): this {
    return this.derivated({ items: [ ...this.items, ...items ] });
  }
  union(other: Group<T>): this {
    return this.withItems(...this.items, ...other.items);
  }
  isEmpty() {
    return this.items.length === 0;
  }
}
