// TODO: investigate

export const nativeConfig = {
    noptions: {
        "metadata.broker.list": "services.fetch.altavian.local:9092", //native client requires broker hosts to connect to
        "group.id": "kafka-streams-test-native",
        "client.id": "kafka-streams-test-name-native",
        "event_cb": true,
        "compression.codec": "snappy",
        "api.version.request": true,

        "socket.keepalive.enable": true,
        "socket.blocking.max.ms": 100,

        "enable.auto.commit": true,
        "auto.commit.interval.ms": 100,

        "heartbeat.interval.ms": 250,
        "retry.backoff.ms": 250,

        "fetch.min.bytes": 100,
        "fetch.message.max.bytes": 2 * 1024 * 1024,
        "queued.min.messages": 10,

        "fetch.error.backoff.ms": 10000,
        "queued.max.messages.kbytes": 50,

        "fetch.wait.max.ms": 10000,
        "queue.buffering.max.ms": 10000,

        "batch.num.messages": 10000
    },
    tconf: {
        "auto.offset.reset": "earliest", //consumer offset latest/earliest
        "request.required.acks": 1 //producer requires ack
    }
};


export const config = {
    // zkConStr: "services.fetch.altavian.local:2181",
    kafkaHost: "services.fetch.altavian.local:9092", //either kafkaHost or zkConStr
    logger: {
      debug: msg => console.log(msg),
      info: msg => console.log(msg),
      warn: msg => console.log(msg),
      error: msg => console.error(msg)
    },
    groupId: "kafka-streams-test",
    clientName: "kafka-streams-test-name",
    workerPerPartition: 1,
    options: {
        sessionTimeout: 10000,
        protocol: ["roundrobin"],
        fromOffset: "earliest", //latest
        fetchMaxBytes: 1024 * 100,
        fetchMinBytes: 1,
        fetchMaxWaitMs: 10,
        heartbeatInterval: 250,
        retryMinTimeout: 250,
        autoCommit: false,
        autoCommitIntervalMs: 1000,
        requireAcks: 1,
        ackTimeoutMs: 100,
        partitionerType: 3
    }
}
