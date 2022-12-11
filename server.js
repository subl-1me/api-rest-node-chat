const app = require('./app');
const server = require('http').createServer(app);
const PORT = process.env.PORT || 3001;
const io = require('socket.io')(server, {
    cors: {
        origin: '*'
    }
})
const swagger = require('./routes/swagger');

// Socket handlers
const requestHandler = require('./services/socket/requestHandler');
const chatHandler = require('./services/socket/chatHandler');
const messageHandler = require('./services/socket/messageHandler');

// socket 
const onConnection = (socket) => {
    requestHandler(io, socket);
    chatHandler(io, socket);
    messageHandler(io, socket);
}

io.on('connection', onConnection);

server.listen(PORT, () => {
    console.log(`Server listen on: http://localhost:${PORT}`)

    swagger(app, PORT);
});

