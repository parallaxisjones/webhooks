import _ from 'lodash'
// import { Types } from 'mongoose'
import { success, notFound } from '../../services/response/'
import Hook  from './models'

const HOOK_NOTIFY = 'HOOK_NOTIFY'; //TODO: make a constants dir in the src folder and export this from there in all places.

/**
* endpoint handler, this gets passed the queue from the request, and the post request body
* responsible for creating jobs
* the jira of the work queue
*/
export const trigger = ({ queue, bodymen: { body }, user }, res, next) => {

  //TODO: remove console log
  console.log('trigger', body);

  //NOTE: create a job on the queue and pass in the user info as well as the body of the post request
  //      this should take place after jwt authorization and exchange for user infos.
  const job = queue
  .createJob({
    type: HOOK_NOTIFY,
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
    // NOTE: all the queue events and job events
    // TODO: these may need to do stuff, such as create topics of their own for tracking purposes.

    const jobId = job.id;
    // register queue events
    queue.on('job succeeded', (jobId, result) => {
      console.log(`Job ${jobId} succeeded with result: ${result}`);
    });
    queue.on('job retrying', (jobId, err) => {
      console.log(`Job ${jobId} failed with error ${err.message} but is being retried!`);
    });
    queue.on('job failed', (jobId, err) => {
      console.log(`Job ${jobId} failed with error ${err.message}`);
    });

    // register job events
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
