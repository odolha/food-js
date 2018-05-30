import { Attribute } from "./attribute";
import { Concept } from "./concept";
import { Group } from "./group";
import { Plugin, PluginDefinition } from "./plugin";
import { Relation } from "./relation";
import { Thing } from "./thing";
import { Value } from "./value";

import { keepUnique } from "@food-js/utils/functions";

export interface FoodJSMaker {
  thing(code?: string): Thing;
  attribute(code?: string): Attribute;
  value<T extends Concept>(code?: string): Value<T>;
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

  // maker interface for registering food-js concepts
  public make: FoodJSMaker;

  // core relation used to define productions
  private produces: Relation;

  constructor(id: string, ...dependencies: FoodJs[]) {
    this.id = id;
    this.dependencies = dependencies;

    const self = this;
    this.make = {
      thing(code?: string): Thing {
        return self.addConcept(new Thing(code));
      },
      attribute(code?: string): Attribute {
        return self.addConcept(new Attribute(code));
      },
      value<T extends Concept>(code?: string): Value<T> {
        return self.addConcept(new Value(code));
      },
      group<T extends Thing>(code?: string): Group<T> {
        return self.addConcept(new Group(code));
      },
      relation(code?: string): Relation {
        return self.addConcept(new Relation(code));
      },
      production(code: string): Relation {
        return self.addConcept(self.produces.withSynonym(self.make.relation(code)));
      },
      plugin(name: string, def: PluginDefinition): Plugin {
        return self.addPlugin(new Plugin(name, def));
      }
    };

    this.produces = this.make.relation('produces');
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

const unitsStore = {};

export const foodjs = {
  unit: (id: string, ...dependencies: FoodJs[]): FoodJs => {
    const existingUnit = unitsStore[id];
    if (existingUnit) {
      existingUnit.dependencies = existingUnit.dependencies.concat(dependencies).reduce(keepUnique, []);
      return existingUnit;
    } else {
      const newModule = new FoodJs(id, ...dependencies);
      unitsStore[id] = newModule;
      return newModule;
    }
  }
};
