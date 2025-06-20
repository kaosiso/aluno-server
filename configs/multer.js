const multer = require("multer");

const storage = multer.diskStorage({}); // optional config
const upload = multer({ storage });

module.exports = upload;
