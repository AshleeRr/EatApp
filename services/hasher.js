import bcrypt from "bcrypt";
//handlers
import { HandRepositoriesAsync } from "../utils/handlers/handlerAsync";

export const Hash = HandRepositoriesAsync(async (Password) => {
  return await bcrypt.hash(Password, 10);
});
