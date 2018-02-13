import { env, mongo, port, ip } from '../config'
import mongoose from '../services/mongoose'
import esClient from '../services/elasticsearch'
import Hook from '../api/hook/models';
import logger from '../services/winston';
const   GRAPH_EVENTS          = ['NODE_COMMIT', 'EDGE_COMMIT']
      , NODE_COMMIT_STREAM    = 'NODE_COMMIT_STREAM'
      , HOOK_CREATE           = 'HOOK_CREATE'
      , HOOK_NOTIFY           = 'HOOK_NOTIFY'
      , HOOK_DELETE           = 'HOOK_DELETE';

// TODO: clean up node/graph events, not needed
// IDEA: check out atom's console log tool.  there's a function to remove all the console logs
mongoose.connect(mongo.uri)


/**
 * ProcessJob - this is basically the same as a redux reducer,
 * it's a switch that switches on a type.
 * There should be 3 types HOOK_CREATE, HOOK_NOTIFY, HOOK_DELETE
 * each case should implement a mongoose model method and do a thing
 *
 * @param  {Object} job  the job coming through, this will have a type and properties
 * @param  {Function} done callback function to signal to the master we have done the thing.
 * @return {Promise}  returns false if something went wrong.  for chaining purposes, this Job may have a future.......
 */
function ProcessJob(job, done) {
  console.log(`Processing job ${job.id}`, job.data);
  //NOTE: this works the exact same as a redux message, except they are called jobs and come out
  //      of a maejic job pipe, when one comes through, we do one of three things
  //
  const {type, properties} = job.data;

  switch(type){
    // TODO: implement HOOK_DELETE
    case HOOK_DELETE:
      return Promise.reject(new Exception("not implemented"))
    }
    case HOOK_CREATE: {
      // NOTE: create a new hook, this happens when a new hook is registered some how.
      //       we don't need to care how or why we got called, only know what to do when we are.
      //       sanity confirm that properties exist and then call create from our Hook mongoose model.
      //       returns false
      // TODO: remove fire method call from this Promise chain
      //       that will be called automatically by the post save hook we have on the model in $BASE_PATH/api/hook/models.js
      return properties && Hook
      .create(properties)
      .then(hooks.map(hook => hook.fire(properties)))
      .catch(done)
    }
    case HOOK_NOTIFY:
    default: {
      // NOTE: this is the main guy, hook notify will get called by all the tings, and put them into the pipe.
      //       any arbitrary consumer of HOOK_NOTIFY topic will be able to do something with this, it should know how.
      //       nothing more than finding matching hook and firing it
      // TODO: this should be a findOne call, we only want to find the hook to make sure we have it,
      // TODO: make a new mongoose model for a call log, a hook gets registered in Hooks, and when it fires,
      //       we add a record to the call log.
      // NOTE: there may also be special instructions on the record in the mongo db such as permissions
      const params = type ? {
        type
      } : {};

      return properties && Hook
      .find(params)
      .then(hooks => hooks.length > 0 ?
        hooks.map(hook => hook.fire(properties))
        : Hook.create(properties).then(hook => hook.fire(properties))
        .then(
          hook => done(null, hook)
        ))
      .catch(done)
    }
  }
}
export default function(id, queue){
  queue.process(ProcessJob);
}
