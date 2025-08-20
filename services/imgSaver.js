import path from "path";
import { HandRepositoriesAsync } from "../utils/handlers/handlerAsync.js";

export const saveIMG = HandRepositoriesAsync(async (file) => {
  if (typeof file === "string") {
    return "\\assets\\imgs\\uploads\\default\\" + file;
  }

  return "\\" + path.relative("public", file.path);
});
