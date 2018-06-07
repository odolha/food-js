const tsConfigPaths = require("tsconfig-paths");

// assures TS works with path mappings after it's compiled to dist
// mapped imports can only occur after this
const baseUrl = "./dist";
tsConfigPaths.register({
  baseUrl,
  paths: require("../../tsconfig.json").compilerOptions.paths
});
