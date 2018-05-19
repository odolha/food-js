import { Collectible } from "./collectible";
import { Attribute } from "./attribute";
import { Concept } from "./concept";
import { Group } from "./group";
import { Plugin, PluginDefinition } from "./plugin";
import { Qualifier } from "./qualifier";
import { Relation } from "./relation";
import { Thing } from "./thing";
import { Value } from "./value";

export { Collectible, Attribute, Concept, Group, Plugin, PluginDefinition, Qualifier, Relation, Thing, Value };

export interface FoodJSFunctions {
  qualifier<T extends Concept>(code?: string): Qualifier<T>;
  value<T extends Concept>(code?: string): Value<T>;
  thing(code?: string): Thing;
  attribute(code?: string): Attribute;
  group<T extends Thing>(code?: string): Group<T>;
  relation(code?: string): Relation;
  production(code: string): Relation;
  plugin(name: string, def: PluginDefinition): Plugin;
}

export class FoodJs {

  private id: string;
  private concepts: Concept[] = [];
  private plugins: Plugin[] = [];
  private dependencies: FoodJs[] = [];

  public functions: FoodJSFunctions;

  // core relation used to define productions
  public produces: Relation;

  constructor(id: string, ...dependencies: FoodJs[]) {
    this.id = id;
    this.dependencies = dependencies;

    const self = this;
    this.functions = {
      qualifier<T extends Concept>(code?: string): Qualifier<T> {
        return self.addConcept(new Qualifier(code));
      },
      value<T extends Concept>(code?: string): Value<T> {
        return self.addConcept(new Value(code));
      },
      thing(code?: string): Thing {
        return self.addConcept(new Thing(code));
      },
      attribute(code?: string): Attribute {
        return self.addConcept(new Attribute(code));
      },
      group<T extends Thing>(code?: string): Group<T> {
        return self.addConcept(new Group(code));
      },
      relation(code?: string): Relation {
        return self.addConcept(new Relation(code));
      },
      production(code: string): Relation {
        return self.addConcept(this.produces.withSynonym(this.relation(code)));
      },
      plugin(name: string, def: PluginDefinition): Plugin {
        return self.addPlugin(new Plugin(name, def));
      }
    };

    this.produces = this.functions.relation('produces');
  }

  private addConcept<T extends Concept>(concept: T): T {
    // TODO: warn on concept ambiguity
    this.concepts.push(concept);
    return concept;
  }

  private addPlugin(plugin: Plugin): Plugin {
    // TODO: warn on concept ambiguity
    this.plugins.push(plugin);
    return plugin;
  }

}

export const foodjs = {
  unit: (id: string, ...dependencies: FoodJs[]) => new FoodJs(id, ...dependencies)
};
