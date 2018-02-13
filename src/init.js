const throng = require('throng');
const numCPUs = require('os').cpus().length;
import master from './master';
import worker from './worker';
const Queue = require('bee-queue');

// NOTE: start a named queue here, our name is webhooks.
// bee-queue is a lightweight queue manager that uses redis to persist it's work queue,
// this way it can distribute the work out to workers
const queue = new Queue('webhooks', {
  redis: {
    host: process.env.REDIS_URL || 'services.fetch.altavian.local',
    port: 6379,
    db: 2
  }
});
// NOTE: throng is a light weight child process manager, reducers boilerplate code
export default throng({
  workers: numCPUs > 4 ? numCPUs : 4,
  master: () => master(queue),
  start: (id) => worker(id, queue)
});
