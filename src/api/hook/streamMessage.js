import esClient from '../../services/elasticsearch'
import logger from '../../services/winston'
import {publisher} from '../../services/redis'
const producer = require('../../services/kafka/producer');
import TopicService from '../../services/kafka/topics';

// TODO: remove redis service, not using redis publisher
// TODO: remove esClient, no clients, only kafka
// TODO: remote the leading underscores from method names
const redisService = require('../../services/redis');

const uuidV1 = require('uuid/v1');
const getTopicName = t => t && t.id,
      getTopicPartition = t => t && t.partition || 0,
      getTopicAttributes = () => 1,
      graphMessages = ['HOOK_ADDED', 'HOOK_UPDATE', 'EDGE_ADD', 'EDGE_REMOVE'],
      HOOK_UPDATE = graphMessages[1],
      topicIndex = topic => topic.name === HOOK_UPDATE;



 /**
  *  @class StreamMessage this is the container that knows about kafka.  it takes
  *  @method {promise} publish
  */
export default class StreamMessage{

  /**
   * constructor - description
   *
   * @param  {Model} doc = null description
   * @param  {Object} message = null   message payload, has a type and properties
   */
  constructor(doc, topics = []){
    this.__doc = doc;
    this.__id = uuidV1();
    this.__STRING_ENCODING__ = 'utf-8';
    this.__message__ = doc.view(true) || {};
    this.__topic_name__ = topics;
  }
  /**
   * @static convertToBuffer - helper function for turning a string into a buffer
   *
   * @param  {String} string = '' string target
   * @return {Buffer}             output buffer
   */
  static convertToBuffer(string = ''){
    return new Buffer(string, this.__STRING_ENCODING__)
  }

  /**
   * @static serialize - helper function
   *
   * @param  {Object} object = {} JSON object
   * @return {String}             string representation of JSON
   */
  static serialize(object = {}){
    return JSON.stringify(object)
  }

  /**
   * getProducer - return the kafka event producer
   *
   * @return {Producer}  kafka producer for stream message
   */
  getProducer(){
    return producer.getProducerForTopic(this.__topic_name__);
  }
  /**
   * getTopic - description
   *
   * @param  {String} topicName = null name of the kafka topic to get if not our own, nullable
   * @return {Promise}                 promise of the ting
   */
  getTopic(topicName = null){
    const message = this;
    const t = topicName || this.__topic_name__ || '';

    //TODO: check to see if this is working
    return TopicService.get({
      name: topicName
    }).then(topic => {
      if(topic){
        message.partitions = topic.partition;
        message.attributes = topic.attributes || 0;
        message.__topic_doc__ = topic;
        return topic;
      }
    })
  }

  /**
   * isReady - bool, are we ready?
   *
   * @return {Boolean}  is ready to use or not
   */
  isReady(){
    return (this.__message__);
  }

  /**
   * __parseObjectMessage - helper
   *
   * @return {type}  wrapper for private util
   */
  __parseObjectMessage(){
    const message = this.__message__;
    return StreamMessage.convertToBuffer(
      StreamMessage.serialize(message)
    )
  }

  /**
   * __packageMessages - helper, packaged the message the right way for kafka.
   * TODO: make topic attributes able to be passed in or gotten async here for custom configuration
   *
   * @return {type}  description
   */
  __packageMessages(){
    const message = this;
    const packet = [{
      topic: message.__topic_name__,
      messages: message.getMessage(),
      attributes: 1
    }]
    console.log(packet);
    return packet
  }

  /**
   * getMessage - get the message form of our PAYLOAD
   *
   * @return {Object}  js object of deserialie message
   */
  getMessage(){
    return (typeof this.__message__ === 'string') ?
    StreamMessage.convertToBuffer(this.__message__) :
    this.__parseObjectMessage()
  }

  /**
   * publish - public method. This should be the only method that is needed 99% of the time, unless for analytics or something
   *
   * @return {type}  description
   */
  publish(callback = function(){}){
    const message = this;
    const onStreamSuccess = (err, res) => {
      if(err){
        return console.log(err)
      }
      console.log(res)
    };

    return message
    .getProducer()
    .then(producer => producer.send(message.__packageMessages(), onStreamSuccess))
  }
}
