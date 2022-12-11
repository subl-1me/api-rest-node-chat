const express = require('express');
const { insert, remove } = require('../controllers/cloudinary');
const router = express.Router();
const multer = require('multer');
const tryCatch = require('../utils/tryCatch')
const errorHandler = require('../middlewares/errorHandler');
const upload = multer();

router.post('/', upload.array('file', 5), errorHandler, tryCatch(insert));
router.delete('/image/:public_id?', errorHandler, tryCatch(remove));

module.exports = router;