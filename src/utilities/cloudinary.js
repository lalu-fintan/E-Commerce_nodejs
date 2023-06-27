const cloudinary = require("cloudinary");

cloudinary.v2.config({
  cloud_name: "danz8ugpr",
  api_key: "624757829732576",
  api_secret: "NFgeEY54D0irV_uTQXzmtPmSmaw",
  secure: true,
});

const cloudinaryUploadImg = async (fileToUploads) => {
  return new Promise((resolve) => {
    cloudinary.uploader.upload(fileToUploads, (result) => {
      resolve(
        {
          url: result.secure_url,
          asset_id: result.asset_id,
          public_id: result.public_id,
        },
        {
          resource_type: "auto",
        }
      );
    });
  });
};

const cloudinaryDeleteImg = async (fileToRemove) => {
  return new Promise((resolve) => {
    cloudinary.uploader.destroy(fileToRemove, (result) => {
      resolve(
        {
          url: result.secure_url,
          asset_id: result.asset_id,
          public_id: result.public_id,
        },
        {
          resource_type: "auto",
        }
      );
    });
  });
};

module.exports = { cloudinaryUploadImg, cloudinaryDeleteImg };
