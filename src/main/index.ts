const tsConfigPaths = require("tsconfig-paths");

// assures TS works with path mappings after it's compiled to dist
// mapped imports can only occur after this
const baseUrl = "./dist";
tsConfigPaths.register({
  baseUrl,
  paths: require("../../tsconfig.json").compilerOptions.paths
});

import app from '@food-js/server/app';

const port = process.env.PORT || 3000;

app.listen(port, (err) => {
  if (err) {
    return console.log(err)
  }

  return console.log(`FoodJS REST server is listening on ${port}`)
});

import { numberUnitOfMeasurements } from "@food-js/library/core-dsl";
numberUnitOfMeasurements.load();

import { simpleToString } from "@food-js/library/commons";
simpleToString.load();

console.log(1.0.grams().toString());
