import { Collectible } from "./collectible";
import { Attribute } from "./attribute";
import { $anonymous } from "./symbols";

export abstract class Concept implements Collectible<Concept> {
  public attributes: Attribute[] = [];
  public synonyms: this[] = [];
  public types: this[] = [];

  constructor(public code: string | symbol = $anonymous) { }

  public get list(): Concept[] {
    return [ this ];
  }

  public readonly conceptType: string | symbol;

  abstract clone(): this;

  derivated(changes: { [key: string]: any }): this {
    return Object.assign(this.clone(), this, changes);
  };

  withAttribute(...attrs: Attribute[]): this {
    return this.derivated({ attributes: [ ...this.attributes, ...attrs ] });
  }
  withSynonym(...synonyms: this[]): this {
    return this.derivated({ synonyms: [ ...this.synonyms, ...synonyms ] });
  }
  ofType(...types: this[]): this {
    return this.derivated({ types: [ ...this.types, ...types ] });
  }
}
