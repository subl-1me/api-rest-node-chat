require('dotenv').config();
const mongoose = require('mongoose');
const URI_URL = process.env.URI_URL;

const dbConnect = () => {
    mongoose.connect(URI_URL).then(
        () => { console.log(('Connected successfully to database.'))},
        err => { console.log('failed: '+ err)}
    );

}

module.exports = {
    dbConnect
}


