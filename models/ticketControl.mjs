import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Para resolver __dirname en un módulo ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Ticket {
  constructor(numero, escritorio) {
    this.numero = numero;
    this.escritorio = escritorio;
  }
}

class TicketControl {
  constructor() {
    this.ultimo = 0;
    this.hoy = new Date().getDate();
    this.tickets = [];
    this.ultimos4 = [];
    this.dataPath = path.join(__dirname, "../db/data.json");

    this.init();
  }

  get toJson() {
    return {
      ultimo: this.ultimo,
      hoy: this.hoy,
      tickets: this.tickets,
      ultimos4: this.ultimos4,
    };
  }

  async init() {
    try {
      const data = await fs.readFile(this.dataPath, "utf-8");
      const jsonData = JSON.parse(data);

      if (jsonData.hoy === this.hoy) {
        Object.assign(this, jsonData);
      } else {
        await this.guardarDB();
      }
    } catch (error) {
      console.error("Error leyendo el archivo JSON:", error);
      await this.guardarDB(); // Si no hay archivo o hay un error, inicializa el archivo.
    }
  }

  async guardarDB() {
    try {
      await fs.writeFile(this.dataPath, JSON.stringify(this.toJson, null, 2));
      console.log("Base de datos guardada");
    } catch (error) {
      console.error("Error al guardar el archivo JSON:", error);
    }
  }

  siguiente() {
    this.ultimo += 1;
    const ticket = new Ticket(this.ultimo, null);
    this.tickets.push(ticket);
    this.guardarDB();
    return "Ticket " + ticket.numero;
  }

  atenderTicket(escritorio) {
    if (this.tickets.length === 0) {
      return null;
    }

    const ticket = this.tickets.shift();
    ticket.escritorio = escritorio;
    this.ultimos4.unshift(ticket);

    if (this.ultimos4.length > 4) {
      this.ultimos4.pop();
      // this.ultimos4.splice(-1,1)
    }

    this.guardarDB();
    return ticket;
  }
}

export { TicketControl, Ticket };
