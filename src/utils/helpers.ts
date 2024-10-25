import crypto from 'node:crypto'
import fs from "node:fs"
import winston from 'winston';


export const generateMD5 = (filePath: string): Promise<string> => {
    return new Promise((resolve) => {
        const hash = crypto.createHash('md5');
        const rStream = fs.createReadStream(filePath);

        rStream.on('data', (data) => {
            hash.update(data);
        });
        rStream.on('end', () => {
            resolve(hash.digest('hex'));
        });
    })
}


const { combine, timestamp, prettyPrint, colorize } = winston.format;

export const winstonLogger = winston.createLogger({
    format: combine(
        timestamp(),
        prettyPrint(),
        colorize({ all: true }),
    ),
    transports: [new winston.transports.Console()]
})
