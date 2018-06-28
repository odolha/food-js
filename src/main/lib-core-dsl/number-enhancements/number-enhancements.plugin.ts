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
} from "@food-js/lib-commons/core.concepts";
import { Attribute } from "@food-js/core";
import { foodjs } from "@food-js/core/foodjs";

declare global {
  interface Number {
    readonly grams: Attribute;
    readonly kgs: Attribute;
    readonly liters: Attribute;
    readonly mls: Attribute;
    readonly items: Attribute;
    readonly seconds: Attribute;
    readonly minutes: Attribute;
    readonly hours: Attribute;
  }
}

export const coreDslUnit = foodjs.unit('@lib-food-js/lib-core-dsl');
const {plugin, value} = coreDslUnit.make;

export const numberUnitOfMeasurements = plugin('number-enhancements', {
  globalExtensions: [
    {
      type: Number,
      attribute: 'grams',
      getter: (self) => weightOf.withQualifier(grams.withQualifier(value(self)))
    },
    {
      type: Number,
      attribute: 'kgs',
      getter: (self) => weightOf.withQualifier(kgs.withQualifier(value(self)))
    },
    {
      type: Number,
      attribute: 'liters',
      getter: (self) => volumeOf.withQualifier(liters.withQualifier(value(self)))
    },
    {
      type: Number,
      attribute: 'mls',
      getter: (self) => volumeOf.withQualifier(mls.withQualifier(value(self)))
    },
    {
      type: Number,
      attribute: 'items',
      getter: (self) => numberOf.withQualifier(value(self))
    },
    {
      type: Number,
      attribute: 'seconds',
      getter: (self) => timeOf.withQualifier(seconds.withQualifier(value(self)))
    },
    {
      type: Number,
      attribute: 'minutes',
      getter: (self) => timeOf.withQualifier(minutes.withQualifier(value(self)))
    },
    {
      type: Number,
      attribute: 'hours',
      getter: (self) => timeOf.withQualifier(hours.withQualifier(value(self)))
    },
  ]
});
