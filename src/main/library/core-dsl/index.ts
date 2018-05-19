import { Attribute, Concept, foodjs, Relation } from "@food-js/core";
import {
  grams,
  hours,
  kgs,
  liters,
  minutes,
  mls,
  numberOf,
  seconds,
  timeOf,
  volumeOf,
  weightOf
} from "@food-js/library/commons";

declare global {
  interface Number {
    grams: () => Attribute;
    kgs: () => Attribute;
    liters: () => Attribute;
    mls: () => Attribute;
    items: () => Attribute;
    seconds: () => Attribute;
    minutes: () => Attribute;
    hours: () => Attribute;
  }
}

export const coreDslUnit = foodjs.unit('@food-js/core-dsl');
const { attribute, plugin, value } = coreDslUnit.functions;

export const numberUnitOfMeasurements = plugin('number-unit-of-measurements', {
  globalExtensions: [
    {
      type: Number,
      method: 'grams',
      implementation: (self) => weightOf.withQualifier(grams.withQualifier(value().withValue(self)))
    },
    {
      type: Number,
      method: 'kgs',
      implementation: (self) => weightOf.withQualifier(kgs.withQualifier(value().withValue(self)))
    },
    {
      type: Number,
      method: 'liters',
      implementation: (self) => volumeOf.withQualifier(liters.withQualifier(value().withValue(self)))
    },
    {
      type: Number,
      method: 'mls',
      implementation: (self) => volumeOf.withQualifier(mls.withQualifier(value().withValue(self)))
    },
    {
      type: Number,
      method: 'items',
      implementation: (self) => numberOf.withQualifier(value().withValue(self))
    },
    {
      type: Number,
      method: 'seconds',
      implementation: (self) => timeOf.withQualifier(seconds.withQualifier(value().withValue(self)))
    },
    {
      type: Number,
      method: 'minutes',
      implementation: (self) => timeOf.withQualifier(minutes.withQualifier(value().withValue(self)))
    },
    {
      type: Number,
      method: 'hours',
      implementation: (self) => timeOf.withQualifier(hours.withQualifier(value().withValue(self)))
    },
  ]
});

export interface DefUtils {
  requires, a, some, taking, sequence
}

export const define = (productionCode: string, productionFn: (defUtils: DefUtils) => Relation) => {
  // XXX
};
