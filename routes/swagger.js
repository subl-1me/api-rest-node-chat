const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

// Metadata info about our API
const options = {
    definition: {
        openapi: "3.0.3",
        info: { title: 'Sendit Chat', version: "1.0.1", description: 'Realtime Chat' }
    },
    apis: ["routes/chat.js", "routes/user.js"]
};

// Docs on JSON format
const swaggerSpec = swaggerJSDoc(options);

// Function to setup our docs
const swaggerDocs  = (app, port) => {
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
    app.get('api/docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    })

    console.log(`Api docs avaialble on: http://localhost:${port}/api/docs`)
}

module.exports = swaggerDocs;