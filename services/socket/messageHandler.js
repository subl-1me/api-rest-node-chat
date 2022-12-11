module.exports = (io, socket) => {

    // payloads contain request
    const sendMessage = (message) => {
        io.emit('listen-messages', message);
    }

    socket.on('send-new-message', sendMessage)
}