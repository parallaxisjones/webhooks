const Kafka = require("kafka-node");
const winston = require('../winston');

// TODO: investigate

const kafkaAddress = process.env.NODE_ENV === 'production' ?
    "kafka:2181" :
    "kafka:2181";
const KAFKA_CONSUMER_EVENTS = {
  ERROR: 'error',
  OOR: 'offsetOutOfRange'
}
const DEFAULT_TOPICS = [];
const options = {
  fromOffset: true,
  autoCommit: true,
  fetchMaxWaitMs: 1000,
  fetchMaxBytes: 1024 * 1024
};

const connect = (topics = DEFAULT_TOPICS) => {
    return new Kafka.Consumer(client, topics, options);
}
module.exports.getConsumer = (topics = null) => {
  const client = new Kafka.Client(kafkaAddress);
  const offset = new Kafka.Offset(client);
  const consumer = connect(topics);

  const resetOffset = (err, offsets) => {
      if (err) {
          winston.error(err);
      }

      const min = Math.min(offsets[topic.topic][topic.partition]);
      consumer.setOffset(topic.topic, topic.partition, min);
  };

  const offsetOutOfRange = (t) => {
      const topic = t;
      topic.maxNum = 2;

      offset.fetch([topic], resetOffset);
  };
  consumer.on("offsetOutOfRange", offsetOutOfRange);

  return consumer;
}
