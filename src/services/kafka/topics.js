const unirest = require('unirest');
import Promise from 'bluebird';
import winston from '../winston';
import redisService from '../redis';
import producer from './producer';
import config  from '../../config';

const TOPIC_SERVICE_URL = config.services.subscription + "/topics";
const DEFAULT_HEADERS = {
  'Accept': 'application/json',
  'Authorization' : `Bearer ${config.jwtSecret}`
};
export default class TopicService{
  static get(opts = {}, headers = null){
    const handler = (resolve, reject) => {
      unirest.get(TOPIC_SERVICE_URL)
      .headers(headers ? Object.assign({}, DEFAULT_HEADERS, headers) : DEFAULT_HEADERS)
      .query(opts)
      .end(response => response.error ? reject(response.error) : resolve(response.body))
    }

    return new Promise(handler)
  }
  static registerTopics(topics = [], headers = null){

      const RESPONSE_TYPE = 'json';
      const PAYLOAD = {topics};
      const ENDPOINT = TOPIC_SERVICE_URL;
      const buildHeader = () => {
        return headers ? Object.assign({
          'Content-Type': 'application/json'
        }, DEFAULT_HEADERS, headers) : DEFAULT_HEADERS
      }
      const getStreamServicePromise = (resolve, reject) => response => {
        console.log(response);
        if(response.error){
          return reject(response.error)
        }
        const createTopicOnProducer = res => {
          const topicMap = topic => ({
            topic: topic.id,
            partition: topic.partition
          })

          const tps = res.map(topicMap);
          return producer.createTopic(tps)
        }

        //register in cache
        // get from cache
        // resolve promise
        // handle error
        return redisService.registerTopics(response.body)
        .then(redisService.getTopics)
        .then(createTopicOnProducer)
        .then(resolve)
        .catch(err => winston.error(err) && reject(err));
    }

    const makeRestCall = topic => {
      console.log("CALL TO MAKE THIS TOPIC");
      return (resolve, reject) => unirest.post(ENDPOINT)
        .headers(buildHeader())
        .type(RESPONSE_TYPE)
        .send(topic)
        .end(getStreamServicePromise(resolve, reject));
    }

    const makePromise = topic => new Promise(makeRestCall(topic));
    const topicPromises = topics.map(makePromise);

    return new Promise.all(topicPromises)
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
        return resolve(response.body);
      })
    )
  }
}
