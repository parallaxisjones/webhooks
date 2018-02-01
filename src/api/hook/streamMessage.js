import esClient from '../../services/elasticsearch'
import logger from '../../services/winston'
import {publisher} from '../../services/redis'
const producer = require('../../services/kafka/producer');
import TopicService from '../../services/kafka/topics';

const redisService = require('../../services/redis');

const uuidV1 = require('uuid/v1');
const getTopicName = t => t && t.id,
      getTopicPartition = t => t && t.partition || 0,
      getTopicAttributes = () => 1,
      graphMessages = ['HOOK_ADDED', 'HOOK_UPDATE', 'EDGE_ADD', 'EDGE_REMOVE'],
      HOOK_UPDATE = graphMessages[1],
      topicIndex = topic => topic.name === HOOK_UPDATE;



 /**
  *  @class StreamMessage
  *  @method {promise} publish
  */
export default class StreamMessage{

  /**
   * constructor - description
   *
   * @param  {Model} doc = null description
   * @param  {type} message = null   description
   * @return {type}                  description
   */
  constructor(doc, topics = []){
    this.__doc = doc;
    this.__id = uuidV1();
    this.__STRING_ENCODING__ = 'utf-8';
    this.__message__ = doc.view(true) || {};
    this.__topic_name__ = topics;
  }
  /**
   * @static convertToBuffer - description
   *
   * @param  {type} string = '' description
   * @return {type}             description
   */
  static convertToBuffer(string = ''){
    return new Buffer(string, this.__STRING_ENCODING__)
  }

  /**
   * @static serialize - description
   *
   * @param  {type} object = {} description
   * @return {type}             description
   */
  static serialize(object = {}){
    return JSON.stringify(object)
  }
  getProducer(){
    return producer.getProducerForTopic(this.__topic_name__);
  }
  /**
   * getTopic - description
   *
   * @param  {type} topicName = null description
   * @return {type}                  description
   */
  getTopic(topicName = null){
    const message = this;
    const t = topicName || this.__topic_name__ || '';
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
   * isReady - description
   *
   * @return {type}  description
   */
  isReady(){
    return (this.__message__);
  }

  /**
   * __parseObjectMessage - description
   *
   * @return {type}  description
   */
  __parseObjectMessage(){
    const message = this.__message__;
    return StreamMessage.convertToBuffer(
      StreamMessage.serialize(message)
    )
  }

  /**
   * __packageMessages - description
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
   * getMessage - description
   *
   * @return {type}  description
   */
  getMessage(){
    return (typeof this.__message__ === 'string') ?
    StreamMessage.convertToBuffer(this.__message__) :
    this.__parseObjectMessage()
  }

  /**
   * publish - description
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
