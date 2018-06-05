import { Relation } from "@food-js/core";

interface ProductionExample {
  productionExample: Relation | (() => Relation),
  productionSetUp?: Function,
  productionTearDown?: Function
}
