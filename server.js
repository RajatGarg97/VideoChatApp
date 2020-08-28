const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

// UUID For generating random urls
const { v4: uuidV4 } = require('uuid');

// Setting view engine to render template files
app.set('view engine', 'ejs');

// Application level Middleware to serve static files
app.use(express.static('public'));

// Home route redirecting to room route
app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`);
});

app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room });
});

// Whenever a user connects
io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        console.log(roomId, userId);
        socket.join(roomId);
        socket.to(roomId).broadcast.emit("user-connected", userId);

        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnected', userId);
        });
    });
});

server.listen(3000);