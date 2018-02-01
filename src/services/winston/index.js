"use strict";
//TODO: Investigate logging strategy with winston for centralizing all logs in elastic search
import winston from 'winston'
import Elasticsearch from 'winston-elasticsearch'
import esClient from '../elasticsearch'
//TODO: remove logging config from hardcoded file
const logging = {
  elastic: {
    requestTimeout: 30000,
    ensureMappingTemplate: false
  },
  console: {
    level: process.env.LOG_LEVEL  || 'verbose',
    prettyPrint: true,
    colorize: true,
    silent: false,
    timestamp: false
  }
}
var logger = new winston.Logger();
logger.add(winston.transports.Console, logging.console);

const registerTransports = error => {
  logger.clear()
  logger.add(winston.transports.Console, logging.console);
  if(!error){
    logger.add(winston.transports.Elasticsearch, {
      ...logging.elastic,
      client: esClient
    })
  }else{
    setTimeout(3000, () => {
      esClient.ping({
        requestTimeout: Infinity
      }, registerTransports);
    })
  }
};
logger.redisError = (err) => {
  err && logger.log('error', 'redis', {
    message: err.message,
    stack: err.stack
  });
}
logger.stream = {
  write: function(message, encoding) {
    logger.info(message);
  }
};

export default logger;
