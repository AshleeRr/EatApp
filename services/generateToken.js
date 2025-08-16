import { promisify } from "util";
import { randomBytes } from "crypto";

export const generateToken = HandRepositoriesAsync(async () => {
  const randomBytesAsync = promisify(randomBytes);
  const buffer = await randomBytesAsync(32);
  return buffer.toString("hex");
});
