import express from "express";
import "dotenv/config";
import cors from "cors";
import { createServer } from "http"; // Importa createServer desde el módulo http
import { Server as SocketIOServer } from "socket.io"; // Importa Server desde socket.io
import { socketController } from "../sockets/controller.mjs";

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.server = createServer(this.app); // Crea el servidor HTTP
    this.io = new SocketIOServer(this.server); // Crea el servidor de sockets
    this.paths = {};

    // Middlewares
    this.middlewares();

    // Rutas de mi app
    this.routes();

    // Configurar sockets
    this.sockets();
  }

  middlewares() {
    // Cors
    this.app.use(cors());

    // Directorio público
    this.app.use(express.static("public"));
  }

  routes() {}

  sockets() {
    this.io.on("connection", socketController);
  }

  listen() {
    this.server.listen(this.port, () => {
      console.log(`http://localhost:${this.port}`);
    });
  }
}

export default Server;
