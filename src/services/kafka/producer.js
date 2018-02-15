import Kafka from 'kafka-node';
import Promise from 'bluebird';
import {KAFKA_ADDRESS} from '../../constants';

import logger from '../winston';

//TODO: investigate

/* Kafka connection parameters */
const partition = 0;
const attributes = 0;
const requireAcks = 1;
import redisService from '../redis';
const kafkaClient = new Kafka.Client(KAFKA_ADDRESS);

function createTopicProducer(topics = [], callback = null){
	const CREATE_TOPICS_ASYNC = true;
	const producer = new Kafka.HighLevelProducer(kafkaClient /*, doc.getOptions()*/)
	const kafkaCallback = callback ? callback : (err, result) => {
		if(err){
			return logger.error(err);
		}
	};
	const createIfNotExist = (err, resp) => {
		if(err){
			return producer.createTopics(topics, CREATE_TOPICS_ASYNC, kafkaCallback)
		}
		console.log("[topics exists] : ", JSON.stringify(resp))
	}

	producer.on('ready',
		() => {
			kafkaClient.loadMetadataForTopics(topics, createIfNotExist);
		}
	)

	return producer;
}
/* Event Pubisher */
const publish = (topic = [], cb = function(){}) => {

  // const log_message = new KeyedMessage('test', 'a message')
  const messages = new Buffer("Simply Easy Learning", "utf-8");
  const payload = topic || [{topic: 'test-sos', messages, attributes: 1}];

	producer.send(payload, cb)
};
module.exports.getProducerForTopic = (topicName = null) => {
	const onProducerSuccess = producer => {
		//register the producer with kafka and then use it to publish a message
	};
	if(!topicName){
		return Promise.reject(false);
	}
	return Promise.resolve(
		createTopicProducer(Array.isArray(topicName) ? topicName : [topicName])
	);
}
module.exports.getProducer = () => producer;
module.exports.createTopic = createTopicProducer;
module.exports.publish = publish;
