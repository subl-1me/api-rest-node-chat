const { verifyToken } = require('../helpers/jwt');
const moment = require('moment');

const authenticate = (req, res, next) => {
    const token = req.headers.authorization;
    if(!token) return res.status(401).send('Unauthorized');

    try{
        const decodedToken = verifyToken(token);
        let now = moment().unix();
        if(now > decodedToken.exo){ // is expired?
            return res.status(401).send('Expired token')
        } 

        next();
    }catch(err){
        return res.status(401).send('Invalid token.');
    }
}

module.exports = authenticate;