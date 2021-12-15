import fs from 'fs';

export function logErrorToFile(error: string, fileName = 'error_log.txt'){
    const log = `${new Date()} ${error} \n`
    fs.appendFileSync(fileName, log);
}