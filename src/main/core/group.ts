import { Collectible } from "./collectible";
import { $group } from "./symbols";
import { Thing } from "./thing";
import { Relation } from "@food-js/core/relation";

export class Group<T extends Thing> extends Thing implements Collectible<T> {
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

}
