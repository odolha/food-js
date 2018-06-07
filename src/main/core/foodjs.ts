import { Attribute } from "./attribute";
import { Concept } from "./concept";
import { Group } from "./group";
import { Plugin, PluginDefinition } from "./plugin";
import { Relation } from "./relation";
import { Thing } from "./thing";
import { AcceptedValueType, Value } from "./value";

import { keepUnique } from "@food-js/utils/functions";

export interface FoodJSMaker {
  thing(code?: string): Thing;
  attribute(code?: string): Attribute;
  value<T extends Concept>(value: AcceptedValueType): Value<T>;
  group<T extends Thing>(...items: T[]): Thing;
  forceGroup<T extends Thing>(...items: T[]): Group<T>;
  relation(code?: string): Relation;
  production(code: string): Relation;
  plugin(name: string, def: PluginDefinition): Plugin;
}

// indispensable relation used to define productions (i.e. all productions will sub-type this)
export const produces = new Relation('produces');

export class FoodJs {
  private id: string;
  private concepts: Concept[] = [];
  private plugins: Plugin[] = [];
  private dependencies: FoodJs[] = [];

  // maker interface for registering lib-food-js concepts
  public make: FoodJSMaker;

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
      value<T extends Concept>(value: AcceptedValueType): Value<T> {
        return self.addConcept(new Value().withValue(value));
      },
      group<T extends Thing>(...items: T[]): Thing {
        if (items.length === 1) {
          return items[0];
        } else {
          return self.make.forceGroup(...items);
        }
      },
      forceGroup<T extends Thing>(...items: T[]): Group<T> {
        return self.addConcept(new Group<T>().withItems(...items));
      },
      relation(code?: string): Relation {
        return self.addConcept(new Relation(code));
      },
      production(code: string): Relation {
        return self.addConcept(self.make.relation(code).ofType(produces));
      },
      plugin(name: string, def: PluginDefinition): Plugin {
        return self.addPlugin(new Plugin(name, def));
      }
    };
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
