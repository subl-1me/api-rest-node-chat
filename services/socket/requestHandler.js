module.exports = (io, socket) => {

    // payloads contain request
    const sendRequest = (request) => {
        io.emit('recieve-request', request);
    }

    socket.on('send-request', sendRequest)
}