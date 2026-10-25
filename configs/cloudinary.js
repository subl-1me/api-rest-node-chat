require("dotenv").config();
const Cloudinary = require("cloudinary").v2;

const cldConfig = {
  api_key: process.env.CLOUDINARY_API_KEY || "",
  cloud_name: process.env.CLOUNDINARY_CLOUD_NAME || "",
  api_secret: process.env.CLOUNDINARY_API_SECRET || "",
};

Cloudinary.config(cldConfig);

module.exports = Cloudinary;
