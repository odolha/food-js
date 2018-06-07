Lists the general backload and broad TODOs that cannot be placed in code:

Next steps
----------
- core-dsl: re-use existing concepts from pool/queue and build smart derivations
- derivation chain (need to think about this - e.g. use to find concepts even if derived)
- relation utils/plugin for
  - extracting relation summary (shortest version)
  - extracting relation procedure (longest version)
  - extracting relation approaches (any version longer than summary)
- categorizing utils/plugin
  - separate concepts by some rule
  - simple pre-defined rule: e.g. to separate food ingredients vs tools
- step-splitter on a Relation/productions utils/plugin
  - extracts smaller relations in a natural order
  - by following the tree deep-first to find leaf relations
- try a larger / real recipe example to see if the API works 
- simple UI to load and show a recipe's
  - ingredients
  - tools
  - steps
- FOOD-specific concept libraries (v1)
- FOOD-specific DSL (v1)
- UI to build recipes

Refactoring
-----------
- Unit testing
- Make units more robust, by disallowing mutation, or allowing it in a more controlled fashion for construction
  - multi-file units will require to be built from a central location
  - or. e.g. by creating new units via merging anonymous ones
- Split into a multi-package approach, rename and re-factor
  - allow core become "foodless" (i.e core can be used for other purposes)
  - foodjs would actually be a collection of libs and plugins and dependent on core
  - remove plugin-specific methods from interfaces that are defined in a higher module
  - instead use TS interface augmentation for types that users can load when a certain plugin is used

Long-term backlog
-----------------
- I18N plugin
- Serialization & de-serialization of concepts (also consider flexible set-ups with different libs available)
- Hierarchical units, versioned units and experiment with the idea of publishing units (e.g. use NPM)
- Image library for concepts and qualified concepts
- Plugin conflicts and warnings

LIST OF THINGS DONE (for motivational purposes)
-------------------
- Initial setup
- At least 3 failed experiments for an API/concept base
- Simple plugin support
- Core domain
- Common lib, some basic plugins, utils
- Core DSL / initial definition
- Examples for canonical and core-dsl definitions
