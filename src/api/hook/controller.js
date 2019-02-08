import _ from 'lodash'
// import { Types } from 'mongoose'
import { success, notFound } from '../../services/response/'
import Hook  from './models'
import {HOOK_NOTIFY} from '../../constants';
//REVIEW: make a constants dir in the src folder and export this from there in all places.

/**
* endpoint handler, this gets passed the queue from the request, and the post request body
* responsible for creating jobs
* the jira of the work queue
*/
export const trigger = ({ queue, bodymen: { body }, user }, res, next) => {

  //NOTE: create a job on the queue and pass in the user info as well as the body of the post request
  //      this should take place after jwt authorization and exchange for user infos.
  let properties = {}
  if(body.repository){
    properties = {
      type: body.repository.slug,
      ...body.repository
    }
  }else{
    properties = {
      ...body,
      ...user
    }
  }
  console.log('HIT WEBHOOK!!', body);
  const job = queue
  .createJob({
    type: 'HOOK_NOTIFY',
    properties
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

    // register job events
    job.on('succeeded', (err, result) => {
      console.log(`Received result for job ${job.id}: `, result);
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
