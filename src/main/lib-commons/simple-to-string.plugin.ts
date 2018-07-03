import { $attribute, $concept, $group, $relation, $thing, $value } from "@food-js/core/symbols";
import { foodjs } from "@food-js/core/foodjs";
import { Relation, Concept, Attribute, Group, Value, Thing } from "@food-js/core";

export const commonsUnit = foodjs.unit('@lib-food-js/lib-commons');
const { plugin } = commonsUnit.make;

const stringifyRelationItem = (concept: Concept, shortcutRelations) => {
  if (concept.conceptType === $relation) {
    return `(${stringify(concept, shortcutRelations)})`; // wrap relation connections for clarity
  } else {
    return stringify(concept, shortcutRelations);
  }
};

const stringify = (concept: Concept, shortcutRelations, asType: string | symbol = concept.conceptType) => {
  if (asType === $attribute) {
    const attribute = concept as Attribute;
    const qualifier = attribute.qualifier;
    if (qualifier.isPlain()) {
      return `@${stringify(attribute, shortcutRelations, $concept)}`;
    } else {
      return `@${stringify(attribute, shortcutRelations, $concept)}:${stringify(qualifier, shortcutRelations)}`;
    }
  } else if (asType === $thing) {
    const thing = concept as Thing;
    if (thing.isNothing()) {
      return 'Ø';
    } else {
      return stringify(thing, shortcutRelations, $concept);
    }
  } else if (asType === $value) {
    const value = concept as Value<any>;
    return `=${value.value.toString()}`;
  } else if (asType === $group) {
    const group = concept as Group<any>;
    return `{${group.items.map(item => stringify(item, shortcutRelations)).join('; ')}}`;
  } else if (asType === $relation) {
    const relation = concept as Relation;
    if (shortcutRelations) {
      return `=>${stringifyRelationItem(relation.output, shortcutRelations)}`;
    } else {
      return `${stringifyRelationItem(relation.input, shortcutRelations)} *${stringify(relation, true, $concept)}* ${stringifyRelationItem(relation.output, shortcutRelations)}`;
    }
  } else {
    if (concept.attributes.length > 0){
      return `${concept.code.toString()}[${concept.attributes.map(a => stringify(a, shortcutRelations)).join(', ')}]`;
    } else {
      return `${concept.code.toString()}`;
    }
  }
};

declare module '@food-js/core/concept' {
  interface Concept {
    toSimpleString(): string;
  }
}

export const simpleToString = plugin('simple-to-string', {
  globalExtensions: [
    {
      type: Concept,
      method: 'toSimpleString',
      implementation: self => stringify(self, false)
    },
    {
      type: Concept,
      method: 'toString',
      implementation: self => {
        const core = stringify(self, false);
        const synonyms = self.synonyms.map(s => stringify(s, false));
        return `${[core, ...synonyms].join('\nAKA\n')}`;
      }
    }
  ]
});
