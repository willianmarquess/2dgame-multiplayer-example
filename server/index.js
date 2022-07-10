const app = require('express');
const http = require('http');
const { Server } = require('socket.io');

const players = {};

const server = http.createServer(app);

const ioConfig = {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
}

const io = new Server(server, ioConfig);

server.listen(3333, () => {
    console.log('server running!');
});

io.on('connection', (socket) => {

    socket.on('player-start', (data) => {
        players[socket.id] = {
            id: socket.id,
            instance: data
        }

        socket.emit('current-players', players);

        socket.broadcast.emit('new-player', players[socket.id]);

    });

    socket.on('player-movement', (data) => {

        players[socket.id] = {
            id: socket.id,
            instance: data
        }

        socket.broadcast.emit('player-moved', {
            id: socket.id,
            instance: data
        });
    });

    socket.on('disconnect', () => {
        delete players[socket.id];
        io.emit('player-disconnected', socket.id);
    });

});



