import { TicketControl } from "../models/ticketControl.mjs";

const ticketControl = new TicketControl();

const socketController = (socket) => {
  // console.log("Cliente conectado", socket.id);
  socket.emit("ultimo-ticket", ticketControl.ultimo);

  socket.on("siguiente-ticket", (payload, callback) => {
    if (typeof callback === "function") {
      const siguiente = ticketControl.siguiente();
      callback(siguiente);
      //notificar que hay un nuevo ticket pendiente
    } else {
      console.error("No se recibió un callback válido");
    }
  });
};

export { socketController };
