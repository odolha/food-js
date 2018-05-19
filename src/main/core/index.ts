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

export const qualifier = <T extends Concept>(code?: string): Qualifier<T> => new Qualifier(code);
export const value = <T extends Concept>(code?: string): Value<T> => new Value(code);
export const thing = (code?: string): Thing => new Thing(code);
export const attribute = (code?: string): Attribute => new Attribute(code);
export const group = <T extends Thing>(code?: string): Group<T> => new Group(code);
export const relation = (code?: string): Relation => new Relation(code);

export const produces = relation('produces'); // core relation used to define productions
export const production = (code: string) => produces.withSynonym(relation(code));

export const plugin = (name: string, def: PluginDefinition) => new Plugin(name, def);

