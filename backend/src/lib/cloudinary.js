//Cloudinary is a cloud-based media management platform used to store, manage, optimize, and deliver images and videos efficiently across web and mobile applications and here we'll use it store profile pictures in a cloud.

//v2 is the function which enables us to make a bucket/cloud to store images or videos.

const { v2 } = require("cloudinary");

const { config } = require("dotenv");

config();

v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = v2;