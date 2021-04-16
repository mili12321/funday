module.exports = connectSockets


function connectSockets(io) {
    io.on('connection', (socket) => {

      socket.on('message', (data) => {
        console.log('data',data);
        io.emit('message', data);
        // socket.broadcast.emit("test", "hello friends!");
        // socket.emit('test', "hello!");
      })
      socket.on("test", (data) => {
        console.log("test");
        io.emit('test', {
         text:'123'
        })
      });
    })
}
