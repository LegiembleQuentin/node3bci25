const { createLogger, format, transports } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

//avec winston, faire des logs d'information, de warning, d'erreur et d'erreur critique
//gérer les rotations de log pour éviter que les fichiers soit trop volumineux
//Gérer le format pour qu'il corresponde à 'MM-DD-YYYY HH:mm:ss'
//Ajouter un middleware pour suivre toutes les requetes
//Capturer les erreurs critique et les signaler avec un envois de mail


const logLevel = {
    levels: {
        info: 0,
        warn: 1,
        error: 2,
        crit: 3
    },
    colors: {
        info: 'green',
        warn: 'yellow',
        error: 'red',
        crit: 'red'
    }
};

const logFormat = format.combine(
    format.colorize(),
    format.timestamp({ format: 'MM-DD-YYYY HH:mm:ss' }),
    format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`)
);

const logger = createLogger({
    levels: logLevel.levels,
    format: logFormat,
    transports: [
        new transports.Console(),
        new DailyRotateFile({
            filename: path.join(__dirname, './logs/app-%DATE%.log'),
            datePattern: 'MM-DD-YYYY',
            zippedArchive: true,
            maxSize: '10m',
            maxFiles: '7d',
            format: format.combine(
                format.uncolorize(),
                format.json()
            )
        }),
        new DailyRotateFile({
            filename: path.join(__dirname, './logs/error-%DATE%.log'),
            datePattern: 'MM-DD-YYYY',
            zippedArchive: true,
            maxSize: '10m',
            maxFiles: '7d',
            format: format.combine(
                format.uncolorize(),
                format.json()
            )
        }),
    ]
});

module.exports = logger;
