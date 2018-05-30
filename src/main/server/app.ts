import * as express from 'express'
import { ProductionExample } from "@food-js/examples/example";

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
      example.productionSetUp();
      res.send(`<pre>${example.productionExample.toString()}</pre>`);
      example.productionTearDown();
    });
    this.express.use('/', router)
  }
}

export default new App().express
