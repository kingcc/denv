const winston = require('winston');

var logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      name: 'console',
      colorize: true,
      level: 'info',
      timestamp: function() {
        return new Date().toTimeString().slice(0, 9);
      }
    }),
    new winston.transports.File({
      name: 'info-file',
      filename: __dirname + '/../logs/info.log',
      level: 'info',
    }),
    new winston.transports.File({
      name: 'error-file',
      filename: __dirname + '/../logs/error.log',
      level: 'error',
      json: false,
      timestamp: function() {
        return new Date().toTimeString();
      }
    })
  ]
});

var log = function(msg, emsg) {
  if (msg instanceof Error) {
    logger.error(emsg || 'error', msg);
  } else {
    logger.info(msg);
  }
};

module.exports = log;
