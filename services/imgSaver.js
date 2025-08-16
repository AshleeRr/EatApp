import path from "path";
import { HandRepositoriesAsync } from "../utils/handlers/handlerAsync.js";

export const saveIMG = HandRepositoriesAsync(async (filePath) => {
  return "\\" + path.resolve("public", filePath);
});
