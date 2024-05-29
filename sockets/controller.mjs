import { TicketControl } from "../models/ticketControl.mjs";

const ticketControl = new TicketControl();

const socketController = (socket) => {
  // console.log("Cliente conectado", socket.id);
  //cuando un cliente se conecta
  socket.emit("ultimo-ticket", ticketControl.ultimo);
  socket.emit("estado-actual", ticketControl.ultimos4);

  //tickets  pendientes
  socket.emit("tickets-pendientes", ticketControl.tickets.length);

  socket.on("siguiente-ticket", (payload, callback) => {
    if (typeof callback === "function") {
      const siguiente = ticketControl.siguiente();
      callback(siguiente);
      socket.broadcast.emit("tickets-pendientes", ticketControl.tickets.length);

      //notificar que hay un nuevo ticket pendiente
    } else {
      console.error("No se recibió un callback válido");
    }
  });

  socket.on("atender-ticket", ({ escritorio }, callback) => {
    if (!escritorio) {
      return callback({
        ok: false,
        msg: "El escritorio es obligatorio",
      });
    }

    const ticket = ticketControl.atenderTicket(escritorio);
    //actualizar/notificar cambios en los ultimos 4
    socket.broadcast.emit("estado-actual", ticketControl.ultimos4);
    socket.emit("tickets-pendientes", ticketControl.tickets.length);
    socket.broadcast.emit("tickets-pendientes", ticketControl.tickets.length);

    if (!ticket) {
      return callback({
        ok: false,
        msg: "Ya no hay tickets pendientes",
      });
    } else {
      callback({
        ok: true,
        ticket,
      });
    }
  });
};

export { socketController };
