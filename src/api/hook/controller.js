import _ from 'lodash'
// import { Types } from 'mongoose'
import { success, notFound } from '../../services/response/'
import Hook  from './models'
// let uppercase = str => {
//   return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
// }
export const trigger = ({ queue, bodymen: { body }, user }, res, next) => {
  console.log('trigger', body);
  const job = queue
  .createJob({
    type: 'HOOK_NOTIFY',
    properties: {
      ...body,
      ...user
    }
  })
  .timeout(3000)
  .retries(2)
  .save()
  .then((job) => {
    // job enqueued, job.id populated
    const jobId = job.id;

    queue.on('job succeeded', (jobId, result) => {
      console.log(`Job ${jobId} succeeded with result: ${result}`);
    });
    queue.on('job retrying', (jobId, err) => {
      console.log(`Job ${jobId} failed with error ${err.message} but is being retried!`);
    });
    queue.on('job failed', (jobId, err) => {
      console.log(`Job ${jobId} failed with error ${err.message}`);
    });
    job.on('succeeded', (result) => {
      console.log(`Received result for job ${job.id}: result`);
    });
    job.on('retrying', (err) => {
      console.log(`Job ${job.id} failed with error ${err.message} but is being retried!`);
    });
    job.on('failed', (err) => {
      console.log(`Job ${job.id} failed with error ${err.message}`);
    });
    return res.status(200).send({
      timestamp: Date.now(),
      jobId: jobId
    });
  }).catch(err => res.status(500).send(err));
}
