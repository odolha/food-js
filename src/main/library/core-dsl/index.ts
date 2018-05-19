import { Attribute, Concept, plugin, Relation, value } from "@food-js/core";
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
    kg: () => Attribute;
    liters: () => Attribute;
    ml: () => Attribute;
    items: () => Attribute;
    seconds: () => Attribute;
    minutes: () => Attribute;
    hours: () => Attribute;
  }
}

export const coreDsl = plugin('@food-js/core-dsl', [() => {
  Number.prototype.grams = function() { return weightOf.withQualifier(grams.withQualifier(value().withValue(this))); };
  Number.prototype.kg = function() { return weightOf.withQualifier(kgs.withQualifier(value().withValue(this))); };
  Number.prototype.liters = function() { return volumeOf.withQualifier(liters.withQualifier(value().withValue(this))); };
  Number.prototype.ml = function() { return volumeOf.withQualifier(mls.withQualifier(value().withValue(this))); };
  Number.prototype.items = function() { return numberOf.withQualifier(value().withValue(this)); };
  Number.prototype.seconds = function() { return timeOf.withQualifier(seconds.withQualifier(value().withValue(this))); };
  Number.prototype.minutes = function() { return timeOf.withQualifier(minutes.withQualifier(value().withValue(this))); };
  Number.prototype.hours = function() { return timeOf.withQualifier(hours.withQualifier(value().withValue(this))); };
}]);

export interface DefUtils {
  requires, a, some, taking, sequence
}

export const define = (productionCode: string, productionFn: (defUtils: DefUtils) => Relation) => {
  // XXX
};
