'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');

const key = 'this-is-webchat-realtime@@..--';

exports.createToken =  function(user){
    var payload = {
        _id: user._id,
        username: user.username,
        email: user.email,
        iat: moment().unix(),
        exo: moment().add(7, 'days').unix()
    }

    return jwt.encode(payload, key);
}

exports.verifyToken = (token) => {
    return jwt.decode(token, key);
}