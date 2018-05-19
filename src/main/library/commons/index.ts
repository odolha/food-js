import { Attribute, attribute, Concept, Group, plugin, Qualifier, Relation, thing, Value, value } from "@food-js/core";

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

export const pluginSimpleStringRepresentations = plugin('simple-string-representations', [
  () => Object.assign(Concept.prototype, {
    toSimpleString(): string {
      if (this.attributes.length > 0){
        return `${this.code.toString()}[${this.attributes.map(a => a.toSimpleString()).join(', ')}]`;
      } else {
        return `${this.code.toString()}`;
      }
    },
    toString() {
      const core = this.toSimpleString();
      const synonyms = this.synonyms.map(s => s.toSimpleString());
      return `${[core, ...synonyms].join('\nAKA\n')}`;
    }
  }),
  () => Object.assign(Qualifier.prototype, {
    toSimpleString() {
      return this.isPlain() ? '' : `${Object.getPrototypeOf(this).toSimpleString.bind(this)()}`;
    }
  }),
  () => Object.assign(Attribute.prototype, {
    toSimpleString() {
      return `@${Object.getPrototypeOf(this).toSimpleString.bind(this)()}:${this.qualifier.toSimpleString()}`;
    }
  }),
  () => Object.assign(Value.prototype, {
    toSimpleString() {
      return `${Object.getPrototypeOf(this).toSimpleString.bind(this)()}<${this.value}>`;
    }
  }),
  () => Object.assign(Group.prototype, {
    toSimpleString() {
      return `{${this.items.map(item => item.toSimpleString()).join(', ')}}`;
    }
  }),
  () => Object.assign(Relation.prototype, {
    toSimpleString() {
      return `${this.input.toSimpleString()} *${Object.getPrototypeOf(this).toSimpleString.bind(this)()}* ${this.output.toSimpleString()}`;
    }
  })
]);
