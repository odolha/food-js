Lists the general backload and broad TODOs that cannot be placed in code:

Next steps
----------
- finalize core-DSL
- relation utils/plugin for
  - extracting relation tags (no synonyms with no input/output)
  - extracting relation summary (shortest version)
  - extracting relation procedure (longest version)
  - extracting relation approaches (any version longer than summary)
- categorizing utils/plugin
  - separate concepts by some rule
  - simple pre-defined rule: e.g. to separate food ingredients vs tools
- step-splitter on a Relation/productions utils/plugin
  - extracts smaller relations in a natural order
  - by following the tree deep-first to find leaf relations
- simple UI to show a recipe's
  - ingredients
  - tools
  - steps

Refactoring
-----------
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
