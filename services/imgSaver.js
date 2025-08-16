import path from "path";
import { HandRepositoriesAsync } from "../utils/handlers/handlerAsync";

export const saveIMG = HandRepositoriesAsync(async (filePath) => {
  return "\\" + path.resolve("public", filePath);
});
