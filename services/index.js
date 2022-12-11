const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const services = {};

fs
    .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) &&
                (file !== basename) &&
                (file.slice(-3) === '.js') &&
                (file.slice(-8) !== '.test.js') &&
                (file !== 'service.js')
    }).map(file => {
        const service = require(path.join(__dirname,file));
        services[service.constructor.name] = service;
    })

    Object.keys(services).forEach(serviceName => {
        if(services[serviceName].associate) {
            services[serviceName].associate(services);
        }
    })

    console.log(services);
    


module.exports = services;
