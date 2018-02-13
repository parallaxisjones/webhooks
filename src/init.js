const throng = require('throng');
const numCPUs = require('os').cpus().length;
import master from './master';
import worker from './worker';
const Queue = require('bee-queue');
const queue = new Queue('webhooks', {
  redis: {
    host: process.env.REDIS_URL || 'services.fetch.altavian.local',
    port: 6379,
    db: 2
  }
});

export default throng({
  workers: numCPUs > 4 ? numCPUs : 4,
  master: () => master(queue),
  start: (id) => worker(id, queue)
});
