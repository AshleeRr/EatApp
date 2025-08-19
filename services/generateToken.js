import { promisify } from "util";
import { randomBytes } from "crypto";
import { HandRepositoriesAsync } from "../utils/handlers/handlerAsync.js";

export const generateToken = HandRepositoriesAsync(async () => {
  const randomBytesAsync = promisify(randomBytes);
  const buffer = await randomBytesAsync(32);
  const pass = buffer.toString("hex");
  return pass;
});
