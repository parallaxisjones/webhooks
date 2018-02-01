import winston from '../winston';
import Promise from 'bluebird';
let __DB_CREDS__ = {
	host: process.env.REDIS_HOST,
	password: process.env.REDIS_PASSWORD || null,
  db: 6
};
const __PUB__CREDS = {
	host: process.env.REDIS_HOST,
	password: process.env.REDIS_PASSWORD || null
};
const SYSTEM_MESSAGES_REDIS_TOPIC = '__FETCH_SYSTEM__';
if(!__DB_CREDS__.password){
	delete __DB_CREDS__.password
}
var client = require('redis').createClient(__DB_CREDS__);
var publisher = require('redis').createClient(__PUB__CREDS);
client.on("error", err => winston.redisError(err));
publisher.on("error", err => winston.redisError(err));

module.exports.publisher = publisher;
module.exports.client = client;
