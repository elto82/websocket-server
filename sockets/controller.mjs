const socketController = (socket) => {
  // console.log("Cliente conectado", socket.id);

  socket.on("disconnect", () => {
    // console.log("Cliente desconectado", socket.id);
  });

  socket.on("enviar-mensaje", (payload, callback) => {
    if (typeof callback === "function") {
      const id = 123;
      callback({ id, fecha: new Date().getTime() });
      socket.broadcast.emit("enviar-mensaje", payload);
    } else {
      console.error("No se recibió un callback válido");
    }
  });
};

export { socketController };
