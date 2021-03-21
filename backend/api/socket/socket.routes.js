module.exports = connectSockets


function connectSockets(io) {
    io.on('connection', (socket) => {
      console.log('connected');
      socket.on('disconnect', function(){
        console.log('disconnected');
      });
    })
}
