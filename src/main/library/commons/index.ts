import {
  Attribute,
  Concept,
  foodjs,
  Group,
  Qualifier,
  Relation,
  Value,
} from "@food-js/core";

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

export const simpleToString = plugin('@food-js/commons/simple-to-string', {
  globalExtensions: [
    {
      type: Concept,
      method: 'toSimpleString',
      implementation: (self) => {
        if (self.attributes.length > 0){
          return `${self.code.toString()}[${self.attributes.map(a => a.toSimpleString()).join(', ')}]`;
        } else {
          return `${self.code.toString()}`;
        }
      }
    },
    {
      type: Concept,
      method: 'toString',
      implementation: (self) => {
        const core = self.toSimpleString();
        const synonyms = self.synonyms.map(s => s.toSimpleString());
        return `${[core, ...synonyms].join('\nAKA\n')}`;
      }
    },
    {
      type: Qualifier,
      method: 'toSimpleString',
      implementation: (self, selfSuperType) => self.isPlain() ? '' : selfSuperType.toSimpleString.apply(self)
    },
    {
      type: Attribute,
      method: 'toSimpleString',
      implementation: (self, selfSuperType) => `@${selfSuperType.toSimpleString.apply(self)}:${self.qualifier.toSimpleString()}`
    },
    {
      type: Value,
      method: 'toSimpleString',
      implementation: (self, selfSuperType) => `${selfSuperType.toSimpleString.apply(self)}<${self.value}>`
    },
    {
      type: Group,
      method: 'toSimpleString',
      implementation: (self) => `{${self.items.map(item => item.toSimpleString()).join(', ')}}`
    },
    {
      type: Relation,
      method: 'toSimpleString',
      implementation: (self, selfSuperType) => `${self.input.toSimpleString()} *${selfSuperType.toSimpleString.apply(self)}* ${self.output.toSimpleString()}`
    }
  ]
});
