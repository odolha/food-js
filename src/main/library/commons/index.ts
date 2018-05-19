import { Attribute, Concept, foodjs, Group, Qualifier, Relation, Thing, Value, } from "@food-js/core";
import { $attribute, $concept, $group, $qualifier, $relation, $thing, $value } from "@food-js/core/symbols";

export const commonsUnit = foodjs.unit('@food-js/commons');
const { attribute, plugin, thing, value } = commonsUnit.functions;

export const base = thing('base');
export const weightOf = attribute('weightOf');
export const volumeOf = attribute('volumeOf');
export const numberOf = attribute('numberOf');
export const timeOf = attribute('timeOf');
export const inside = attribute('inside');
export const having = attribute('having');
export const being = attribute('being');
export const heavy = value('heavy');

export const grams = attribute('grams');
export const kgs = attribute('kgs');
export const liters = attribute('liters');
export const mls = attribute('mls');
export const seconds = attribute('seconds');
export const minutes = attribute('minutes');
export const hours = attribute('hours');

// TODO: investigate alternatives to better integrate multi-type polymorphic plugged-in methods
const stringify = (concept: Concept, asType: string | symbol = concept.conceptType) => {
  if (asType === $attribute) {
    const attribute = concept as Attribute;
    const qualifier = attribute.qualifier;
    if (qualifier.isPlain()) {
      return `@${stringify(attribute, $concept)}`;
    } else {
      return `@${stringify(attribute, $concept)}:${stringify(qualifier)}`;
    }
  } else if (asType === $value) {
    const value = concept as Value<any>;
    return `<${value.value}>`;
  } else if (asType === $group) {
    const group = concept as Group<any>;
    return `{${group.items.map(item => stringify(item)).join(', ')}}`;
  } else if (asType === $relation) {
    const relation = concept as Relation;
    return `${stringify(relation.input)} *${stringify(relation, $concept)}* ${stringify(relation.output)}`;
  } else {
    if (concept.attributes.length > 0){
      return `${concept.code.toString()}[${concept.attributes.map(a => stringify(a)).join(', ')}]`;
    } else {
      return `${concept.code.toString()}`;
    }
  }
};

export const simpleToString = plugin('@food-js/commons/simple-to-string', {
  globalExtensions: [
    {
      type: Concept,
      method: 'toSimpleString',
      implementation: self => stringify(self)
    },
    {
      type: Concept,
      method: 'toString',
      implementation: self => {
        const core = stringify(self);
        const synonyms = self.synonyms.map(s => stringify(s));
        return `${[core, ...synonyms].join('\nAKA\n')}`;
      }
    }
  ]
});
