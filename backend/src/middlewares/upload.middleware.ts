import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDirectory = "uploads/radiology";

fs.mkdirSync(uploadDirectory, {
  recursive: true,
});

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDirectory);
  },

  filename(req, file, cb) {
    const extension = path.extname(file.originalname);

    cb(
      null,
      `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}${extension}`
    );
  },
});

export const uploadRadiologyImages = multer({
  storage,

  limits: {
    files: 20,
    fileSize: 20 * 1024 * 1024,
  },

  fileFilter(req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      return cb(null, true);
    }

    cb(new Error("Only image uploads are allowed"));
  },
});