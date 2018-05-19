import * as express from 'express'

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
      const production = require(`@food-js/examples/${req.params.name}`);
      res.send(production.toString());
    });
    this.express.use('/', router)
  }
}

export default new App().express
