const cloudinaryService = require('../services/cloudinary');

const AppError = require('../AppError');
const { NO_IMAGES } = require('../constans/errorCodes');

const insert = async function (req, res){
    const response = await cloudinaryService.uploadImages(req);

    return res.status(200).send(response)
}

const remove = async function(req, res){
    const { images } = req.body;
    if(!images) throw new AppError(NO_IMAGES, 'public_id identifier not found.', 400);

    const response = await cloudinaryService.deleteImages(images);
    return res.status(200).send(response);
}

module.exports = {
    insert,
    remove
}