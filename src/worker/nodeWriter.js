import { env, mongo, port, ip } from '../config'
import mongoose from '../services/mongoose'
import esClient from '../services/elasticsearch'
import Hook from '../api/hook/models';
import logger from '../services/winston';
const   GRAPH_EVENTS          = ['NODE_COMMIT', 'EDGE_COMMIT']
      , NODE_COMMIT_STREAM    = 'NODE_COMMIT_STREAM'
      , HOOK_CREATE           = 'HOOK_CREATE'
      , HOOK_NOTIFY           = 'HOOK_NOTIFY';
mongoose.connect(mongo.uri)
function ProcessJob(job, done) {
  console.log(`Processing job ${job.id}`, job.data);
  const {type, properties} = job.data;
  switch(type){
    case HOOK_CREATE: {
      return properties && Hook
      .create(properties)
      .then(hooks.map(hook => hook.fire(properties)))
      .catch(done)
    }
    case HOOK_NOTIFY:
    default: {
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
