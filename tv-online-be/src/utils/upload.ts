import multer from "multer";

export const upload = multer({
  storage: multer.diskStorage({
    destination(_req, _file, cb) {
      cb(null, "uploads/");
    },
    filename(_req, file, cb) {
      const fileName =
        new Date().toISOString() + "_" + file.originalname.replace(/\s/g, "_");
      cb(null, fileName);
    },
  }),
});
