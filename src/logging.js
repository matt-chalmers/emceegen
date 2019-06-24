
import winston from 'winston';
import config from 'config';


const logger = winston.createLogger({
    level: config.logging.level,
    transports: []
});

const LOGDIR = 'logs/genemcee/';
const labelFormat = winston.format.label('genemcee');

if (config.logging.fileLogging) {
    // Write all logs error (and below) to `error.log`.
    logger.add(
        new winston.transports.File({
            filename: LOGDIR + 'error.log',
            format: winston.format.combine(
                winston.format.splat(),
                winston.format.timestamp(),
                winston.format.json(),
                labelFormat
            ),
            level: 'error'
        })
    );
    logger.add(
        new winston.transports.File({
            filename: LOGDIR + 'error-readable.log',
            format: winston.format.combine(
                winston.format.splat(),
                winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
                winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`),
                labelFormat
            ),
            level: 'error'
        })
    );

    // Write to all logs with level `info` and below to `application.log`
    logger.add(
        new winston.transports.File({
            format: winston.format.combine(
                winston.format.splat(),
                winston.format.timestamp(),
                winston.format.json(),
                labelFormat
            ),
            filename: LOGDIR + 'application.log'
        })
    );
    logger.add(
        new winston.transports.File({
            format: winston.format.combine(
                winston.format.splat(),
                winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
                winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`),
                labelFormat
            ),
            filename: LOGDIR + 'application-readable.log'
        })
    );
}

if (config.logging.consoleLogging) {
    logger.add(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.splat(),
                winston.format.simple(),
                labelFormat
            )
        })
    );
}

export {logger as default};
