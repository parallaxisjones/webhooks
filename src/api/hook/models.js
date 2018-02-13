import mongoose, { Schema } from 'mongoose'
import mongoosastic from 'mongoosastic'
import logger from '../../services/winston'
const producer = require('../../services/kafka/producer');
let seeder = require('../../services/seeder')
const uuidV1 = require('uuid/v1');
import StreamMessage from './streamMessage';
import esClient from '../../services/elasticsearch';

//TODO: Make a script header
//TODO: clean up console logs when finished
// TODO: ESLint setup
// IDEA: build a directory watcher service that creates todos and such

const HOOK_NOTIFY  = 'HOOK_NOTIFY';

const HOOK_SCHEMA = {
  esindex: {
    type: String,
    defaultValue: 'webhooks'
  },
  type: {
    type: String,
    defaultValue: 'action'
  },
  properties: {
    type: Object
  }
}
const HOOK_SCHEMA_OPTIONS = {
  timestamps: true
}

const HOOK_METHODS = {
  Indexer: function(opts = {}, callback = function(){}) {
    this.index(opts, callback)
  },
  fire({ type, properties }){
    // console.log('fired data', type, properties);
    // const message = new StreamMessage(properties, type)
    // message.publish()
    return this.view(true)
  },
  view (full) {
    const view = {
      index: this.esindex,
      type: this.type,
      properties: this.properties
    }
    return full ? {
      ...view,
      id: this.id,
      // add properties for a full view
    } : view
  }
}
// register schema
const HookSchema = new Schema(HOOK_SCHEMA, HOOK_SCHEMA_OPTIONS)
HookSchema.methods = HOOK_METHODS

HookSchema.post('save', doc => {
  console.log('post save', doc);

  // NOTE: producer logic lives in stream message, to produce a new one do this:
  const hook = doc.toJSON()
  const message = new StreamMessage(hook, HOOK_NOTIFY)

  // TODO: this should be implemented as doc.fire()
  message.publish();
  return model;
})

// TODO: None of this old es stuff needs to happen
//
//  here, we need to make sure that we have an elasticsearch connection, and then  register the shit on the model.
// that's why it's wrapped in a function here.
// the post save hook is also here and this is not working, so the hook is not working
//
// TODO: Move post save hook into the HOOK_METHODS, there is a method there stubbed out called fire.
// that should fire a message, the message should get passed in on creation of the hook document in the db,
// and then fire get's called after to tell the stream it has a new message
// that way when we need to use
//
// const registerElasticPlugin = () => {
//   HookSchema.plugin(mongoosastic, {
//     esClient,
//     indexAutomatically: false,
//     customSerialize: (model, mapping) => {
//       if(model.mapping){
//         console.log('document mapping', model.mapping);
//       }
//       hook = model.view(true);
//       return hook.properties;
//     }
//
//   })
//
//   HookSchema.post('save', doc => {
//     console.log('post save', doc);
//
//     // TODO: Get rid of the elasticsearch BS
//     // doc.Indexer({
//     //   type: doc.type || 'hook'
//     // }, function(err, hook){
//     //   const message = new StreamMessage(hook, 'HOOK_NOTIFY')
//     //   message.publish();
//     // })
//
//     // INFO: producer logic lives in stream message, to produce a new one do this:
//     const hook = doc.toJSON()
//     const message = new StreamMessage(hook, HOOK_NOTIFY)
//     message.publish();
//     return model;
//   })
// }


// TODO: this can go away, it's dumb
// const tryRegister = (callback) => {
//   esClient.ping({
//     // ping usually has a 3000ms timeout
//     requestTimeout: 1000
//   }, function (error) {
//     if (error) {
//       //TODO: google how to set this to execute immediately
//       setTimeout(callback, 1000)
//     } else {
//       callback()
//     }
//   });
// }
// HACK ping es until it's there and then registerElasticPlugin
// we need to do this bc we don't know if a server is there or NOT
// code should be paranoid
// tryRegister(registerElasticPlugin)

const Hook = mongoose.model('Hook', HookSchema)

export default Hook;
