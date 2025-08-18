import path from "path";
import { HandRepositoriesAsync } from "../utils/handlers/handlerAsync.js";

export const saveIMG = HandRepositoriesAsync(async (file) => {
  return "\\" + path.relative("public", file.path);
});
