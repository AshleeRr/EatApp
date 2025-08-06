import multer from "multer";
import path from "path";
import { projectRoot } from "../../utils/Paths.js";

const UserMulter = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(projectRoot, "public", "assets", "imgs", "uploads"));
  },
  filename: (req, file, cb) => {
    const Ramdom = Math.random * 10000;
    const fileName = `${Ramdom}-${file.originalname}`;
    cb(null, fileName);
  },
});

export default UserMulter;
