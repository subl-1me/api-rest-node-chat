module.exports = (io, socket) => {

    // payloads contain request
    const pushNewchat = ({chat, request}) => {
        io.emit('push-new-chat', {chat, request});
    }

    const updateParticipantList = ({user, action, chatId}) => {
        io.emit('listen-participant-updates', {user, action, chatId});
    }

    const listenTypingUser = ({chatId, user, isTyping}) => {
        io.emit('listen-typing', {chatId, user, isTyping})
    }


    socket.on('send-new-chat', pushNewchat)
    socket.on('update-participants', updateParticipantList);
    socket.on('listen-typing', listenTypingUser);
}