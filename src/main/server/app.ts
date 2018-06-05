import * as express from 'express'
import { ProductionExample } from "@food-js/examples/example";
import { Relation } from "@food-js/core";
import { doNothing } from "@food-js/utils/functions";

class App {
  public express;

  constructor () {
    this.express = express();
    this.mountRoutes()
  }

  private mountRoutes (): void {
    const router = express.Router();
    router.get('/', (req, res) => {
      res.json({
        message: 'Hello World!'
      })
    });
    router.get('/example/:name', (req, res) => {
      const { example } : { example: ProductionExample } = require(`@food-js/examples/${req.params.name}`);
      (example.productionSetUp || doNothing)();
      const exampleResult = example.productionExample instanceof Relation ? example.productionExample : example.productionExample();
      res.send(`<pre>${exampleResult.toString()}</pre>`);
      (example.productionTearDown || doNothing)();
    });
    this.express.use('/', router)
  }
}

export default new App().express
