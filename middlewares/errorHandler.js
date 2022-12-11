const AppError = require('../AppError');

const errorHandler = (error, _req, res, next) => {
    console.log(error);
    if(error instanceof AppError){
        return res.status(error.statusCode).send({
            message: error.message,
            statusCode: error.statusCode,
            errorCode: error.errorCode
        });
    }

    return res.status(500).send({
        status: 'error',
        message: 'Something went wrong'
    });
}

module.exports = errorHandler;