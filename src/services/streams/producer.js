const unirest = require('unirest');
import Promise from 'bluebird';
import winston from '../winston';
import redisService from '../redis';
import producer from './producer';
const TOPIC_SERVICE_URL = 'http://streams/producer'
const DEFAULT_HEADERS = {'Accept': 'application/json'};
export default class TopicService{
  static get(opts = {}, headers = null){

    const handler = (resolve, reject) =>
    unirest.get(TOPIC_SERVICE_URL)
    .headers(headers ? Object.assign({}, DEFAULT_HEADERS, headers) : DEFAULT_HEADERS)
    .query(opts)
    .end(response => {
      if(response.error){
        winston.error(response.error)
        return reject(response.error)
      }
      winston.info(response.body);

      return resolve(response.body);
    })
    return new Promise(handler)
  }
  static registerTopics(topics = [], headers = null){
    winston.info('CALLING STREAM SERVICE', TOPIC_SERVICE_URL)
    return new Promise(
      (resolve, reject) => {
        const t = topics;
        return unirest.post(TOPIC_SERVICE_URL)
        .headers(headers ? Object.assign({
          'Content-Type': 'application/json'
        }, DEFAULT_HEADERS, headers) : DEFAULT_HEADERS)
        .type('json')
        .send({topics: t})
        .end(response => {
          if(response.error){
            winston.error(response.error)
            return reject(response.error)
          }
          return redisService.registerTopics(response.body)
          .then(result => {
            return redisService.getTopics()
            .then(res => {
              return producer.createTopic(res.map(topic => {
                return {
                  topic: topic.id,
                  partition: topic.partition
                }
              })).then( response => {
                console.log(response);

                return res
              })
            })
            .then(res => winston.info(res))
            .catch(err => winston.error(err))

            return resolve(result);
          }).catch(reject)
        })
      }
    )
  }
  static register(topic = 'fetch-message', headers = null){
    return new Promise(
      (resolve, reject) =>
      unirest.post(TOPIC_SERVICE_URL)
      .headers(headers ? Object.assign({
        'Content-Type': 'application/json'
      }, DEFAULT_HEADERS, headers) : DEFAULT_HEADERS)
      .send({topic})
      .end(response => {
        if(response.error){
          return reject(response.error)
        }
        winston.info(response);

        return resolve(response.body);
      })
    )
  }
}
