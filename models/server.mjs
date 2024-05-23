import express from "express";
import "dotenv/config";
import cors from "cors";

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.paths = {};

    // Middlewares
    this.middlewares();

    // Rutas de mi app
    this.routes();
  }

  middlewares() {
    // Cors
    this.app.use(cors());

    // Directorio público
    this.app.use(express.static("public"));
  }

  routes() {}

  listen() {
    this.app.listen(this.port, () => {
      console.log(`http://localhost:${this.port}`);
    });
  }
}

export default Server;
