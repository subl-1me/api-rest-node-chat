const bcrypt = require('bcrypt');

const encryptMessage = async (message) => {
    const tempKey = message.chat;
    bcrypt.hash(message.content, 10)
    .then((hash) => {
        message.content = hash;
        return message
    })
    .catch(err => null);
}

module.exports = {
    encryptMessage
}
