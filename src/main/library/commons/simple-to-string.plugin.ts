import { $attribute, $concept, $group, $relation, $value } from "@food-js/core/symbols";
import { foodjs } from "@food-js/core/foodjs";
import { Relation, Concept, Attribute, Group, Value } from "@food-js/core";

export const commonsUnit = foodjs.unit('@food-js/commons');
const { plugin } = commonsUnit.functions;

// TODO: investigate alternatives to better integrate multi-type polymorphic plugged-in methods

const stringifyRelationItem = (concept: Concept) => {
  if (concept.conceptType === $relation) {
    return `(${stringify(concept)})`; // wrap relation connections for clarity
  } else {
    return stringify(concept);
  }
};

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
    return `${stringifyRelationItem(relation.input)} *${stringify(relation, $concept)}* ${stringifyRelationItem(relation.output)}`;
  } else {
    if (concept.attributes.length > 0){
      return `${concept.code.toString()}[${concept.attributes.map(a => stringify(a)).join(', ')}]`;
    } else {
      return `${concept.code.toString()}`;
    }
  }
};

export const simpleToString = plugin('simple-to-string', {
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
