const unirest = require('unirest');
import Promise from 'bluebird';
import logger from '../winston';
import config from '../../config'

// TODO: investigate

const TOPIC_SERVICE_URL = config.services.subscription + "/subscriptions"

const DEFAULT_HEADERS = {
  'Accept': 'application/json',
  'Authorization' : `Bearer ${config.jwtSecret}`
};
export default class SubscriptionService{
  static listBySubscriberId(subscriber){
    return SubscriptionService.get({
      subscriber
    })
  }
  static get(opts = {}, headers = null){
    const handler = (resolve, reject) =>
    unirest.get(TOPIC_SERVICE_URL)
    .headers(headers ? Object.assign({}, DEFAULT_HEADERS, headers) : DEFAULT_HEADERS)
    .query(opts)
    .end(response => {
      if(response.error){
        return reject(response.error)
      }

      return resolve(response.body);
    })
    return new Promise(handler)
  }
  static subscribe(topic = 'fetch-message', headers = null){
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
