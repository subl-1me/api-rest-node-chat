const Streamifier = require("streamifier");
const Cloudinary = require("../configs/cloudinary");
const Service = require("./service");

class CloudinaryService extends Service {
  async deleteImages(images) {
    try {
      images.forEach(async (image) => {
        await Cloudinary.uploader.destroy(image.public_id, (err, res) => {
          if (err) {
            return { status: "error" };
          }
        });
      });

      return {
        status: "success",
        message: "Image/s deleted successfully",
      };
    } catch (err) {
      return {
        status: "error",
        message: "Something went wrong.",
      };
    }
  }

  async uploadImages(req) {
    const buffers = req.files.map((file) => {
      return file.buffer;
    });

    const cldServiceResponses = [];
    buffers.forEach((buffer) => {
      cldServiceResponses.push(this.sendStreamBuffer(buffer));
    });

    return Promise.all(cldServiceResponses)
      .then((images) => {
        return {
          status: "success",
          images: images,
        };
      })
      .catch(() => {
        return {
          status: "error",
          message: "Error promises not resolved.",
        };
      });
  }

  sendStreamBuffer = (buffer) => {
    return new Promise((resolve, reject) => {
      let stream = Cloudinary.uploader.upload_stream((error, result) => {
        if (result) resolve(result);

        reject(error);
      });

      Streamifier.createReadStream(buffer).pipe(stream);
    });
  };
}

module.exports = new CloudinaryService();
