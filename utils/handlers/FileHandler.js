import fs from "fs";
import path from "path";
import { projectRoot } from "../Paths.js";
import multer from "multer";
import { v4 as guidV4 } from "uuid";

export function GetAllDataFromFile(dataPath, callback) {
  fs.readFile(dataPath, function (err, data) {
    if (err) {
      callback([]);
    } else {
      callback(JSON.parse(data));
    }
  });
}

export function SaveDataInFile(dataPath, data) {
  fs.writeFile(dataPath, JSON.stringify(data), function (err, data) {
    if (err) {
      console.error("Error saving data:", err);
    }
  });
}

const imageStorageForBusinessLogo = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(
      null,
      path.join(
        projectRoot,
        "public",
        "assets",
        "imgs",
        "uploads",
        "users-uploads",
        "bussiness-logos"
      )
    );
  },
  filename: (req, file, cb) => {
    const fileName = `${guidV4()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const imageStorageForProfilePhotos = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(
      null,
      path.join(
        projectRoot,
        "public",
        "assets",
        "imgs",
        "uploads",
        "users-uploads",
        "profiles-photos"
      )
    );
  },
  filename: (req, file, cb) => {
    const fileName = `${guidV4()}-${file.originalname}`;
    cb(null, fileName);
  },
});

export const saveProfilePhoto = multer({
  storage: imageStorageForProfilePhotos,
});
export const saveBusinessLogo = multer({
  storage: imageStorageForBusinessLogo,
});
