import { inside } from "@food-js/library/commons";

// very basic decomposition to show complexity in canonical description
import { fish, friedFish, fry, oil, oily, pan, pepper, salt, seasoned } from "@food-js/library/food";
import { foodjs } from "@food-js/core";

/*
import { pluginSimpleStringRepresentations } from "@food-js/library/commons";
pluginSimpleStringRepresentations.load();
*/

const fryFishExample = foodjs.unit('fry-fish-example');
const { production, group } = fryFishExample.functions;

const fryFish = production('fryFish')
    .withInput(
      production('panFried')
        .withInput(
          group().withItems(
            pan,
            oil,
            production('season')
              .withInput(group().withItems(fish, salt, pepper))
              .withOutput(group().withItems(fish.withAttribute(seasoned.withQualifier(group().withItems(salt, pepper)))))
          )
        )
        .withOutput(
          fish.withAttribute(inside.withQualifier(pan), oily)
        )
    )
    .withOutput(
      friedFish
    )
    .withSynonym(
      fry.withInput(group().withItems(fish)).withOutput(group().withItems(friedFish))
    );

console.log(fryFish.toString());

export default fryFish;
