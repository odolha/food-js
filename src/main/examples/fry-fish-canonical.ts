// very basic decomposition to show complexity in canonical description
import { foodjs } from "@food-js/core/foodjs";
import { fish, friedFish, fry, oil, oily, pan, pepper, salt, seasoned } from "@food-js/lib-food/common.concepts";
import { inside, tagged } from "@food-js/lib-commons/core.concepts";
import { simpleToString } from "@food-js/lib-commons/simple-to-string.plugin";
import { ProductionExample } from "@food-js/examples/example";

const fryFishExample = foodjs.unit('fry-fish-example');
const { production, group, value } = fryFishExample.make;

const productionSetUp = () => simpleToString.load();
const productionTearDown = () => simpleToString.unload();

const fryFish = fry.withAttribute(tagged.withQualifier(value('fryFish')))
    .withInput(
      production('panFried')
        .withInput(
          group(
            pan,
            oil,
            production('season')
              .withInput(group(fish, salt, pepper))
              .withOutput(group(fish.withAttribute(seasoned.withQualifier(group(salt, pepper)))))
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
      fry.withInput(group(fish)).withOutput(group(friedFish))
    );

export const example: ProductionExample = { productionExample: fryFish, productionSetUp, productionTearDown };
