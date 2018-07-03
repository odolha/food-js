import { foodjs } from "@food-js/core/foodjs";
import { Attribute, Concept, Group, Relation, Value } from "@food-js/core";
import { $attribute, $group, $relation, $value } from "@food-js/core/symbols";

export const commonsUnit = foodjs.unit('@lib-food-js/lib-commons');
const { plugin } = commonsUnit.make;

const baseEquals = (self: Concept, other: Concept) => {
  if (self.conceptType === $value) {
    return valueEquals(self as Value<any>, other as Value<any>);
  } else if (self.conceptType === $attribute) {
    return attributeEquals(self as Attribute, other as Attribute);
  } else if (self.conceptType === $relation) {
    return relationEquals(self as Relation, other as Relation);
  } else if (self.conceptType === $group) {
    return groupEquals(self as Group<any>, other as Group<any>);
  } else {
    return conceptEquals(self, other);
  }
};

const conceptEquals = (self: Concept, other: Concept) => {
  if (!other) {
    return false;
  }
  if (self === other) {
    return true;
  }
  if (self.conceptType !== other.conceptType) {
    return false;
  }
  const eqCode = () => self.id === other.id;
  const eqAttrsLength = () => self.attributes.length === other.attributes.length;
  const eqAttrs = () => self.attributes.every((attr, idx) => baseEquals(attr, other.attributes[idx]));
  return eqCode() && eqAttrsLength() && eqAttrs();
};

const attributeEquals = (self: Attribute, other: Attribute) => {
  return conceptEquals(self, other) && baseEquals(self.qualifier, other.qualifier);
};

const valueEquals = (self: Value<any>, other: Value<any>) => {
  return conceptEquals(self, other) && self.value === other.value;
};

const relationEquals = (self: Relation, other: Relation) => {
  return conceptEquals(self, other) && baseEquals(self.input, other.input) && baseEquals(self.output, other.output);
};

const groupEquals = (self: Group<any>, other: Group<any>) => {
  return conceptEquals(self, other)
    && self.items.length === other.items.length
    && self.items.every((item, idx) => baseEquals(item, other.items[idx]));
};

declare module '@food-js/core/concept' {
  interface Concept {
    equals(other: Concept): boolean;
  }
  interface Value {
    equals(other: Value): boolean;
  }
  interface Attribute {
    equals(other: Attribute): boolean;
  }
  interface Relation {
    equals(other: Relation): boolean;
  }
  interface Group {
    equals(other: Group): boolean;
  }
}

export const simpleEquals = plugin('simple-equals', {
  globalExtensions: [
    {
      type: Concept,
      method: 'equals',
      implementation: baseEquals
    }
  ]
});
