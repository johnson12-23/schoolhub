import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, path.resolve("uploads"));
  },
  filename: (_req, file, callback) => {
    const safeName = file.originalname.replace(/\s+/g, "-").toLowerCase();
    callback(null, `${Date.now()}-${safeName}`);
  }
});

function fileFilter(_req, file, callback) {
  if (file.mimetype !== "application/pdf") {
    callback(new Error("Only PDF files are allowed"));
    return;
  }

  callback(null, true);
}

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

