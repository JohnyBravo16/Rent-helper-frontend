const multer = require("multer");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

//file uploading
const storage = multer.diskStorage({
  // function executed when Multer tries to save the file
  destination: (req, file, callback) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    callback(error, "images");
  },
  // specify uploaded file name
  filename: (req, file, callback) => {
    const name = file.originalname
    .toLowerCase()
    .split(' ')
    .join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    callback(null, name + "-" + Date.now() + "." +ext);
  }
});

module.exports = multer({storage: storage}).single("image");
