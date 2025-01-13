const multer = require("multer");

// Cấu hình Multer để lưu file vào bộ nhớ
const storage = multer.memoryStorage(); // Lưu file trong bộ nhớ RAM
const upload = multer({ storage });

module.exports.uploadAvatar = upload.single("avatar");
