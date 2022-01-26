import fs from "fs";

export function logErrorToFile(
  error: string,
  fileName = "error_log.txt"
): void {
  const log = `${new Date().toString()} ${error} \n`;
  fs.appendFileSync(fileName, log);
}
