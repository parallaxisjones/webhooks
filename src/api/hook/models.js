//TODO: Make a script header
//TODO: clean up console logs
// IDEA: build a directory watcher service that creates todos and such
import mongoose, { Schema } from 'mongoose'
import mongoosastic from 'mongoosastic'
import logger from '../../services/winston'
const producer = require('../../services/kafka/producer');
let seeder = require('../../services/seeder')
const uuidV1 = require('uuid/v1');
import StreamMessage from './streamMessage';
import esClient from '../../services/elasticsearch'

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
const registerElasticPlugin = () => {
  HookSchema.plugin(mongoosastic, {
    esClient,
    indexAutomatically: false,
    customSerialize: (model, mapping) => {
      if(model.mapping){
        console.log('document mapping', model.mapping);
      }
      hook = model.view(true);
      return hook.properties;
    }

  })

  HookSchema.post('save', doc => {
    console.log('post save', doc);
    doc.Indexer({
      type: doc.type || 'hook'
    }, function(err, hook){
      const message = new StreamMessage(hook, 'HOOK_NOTIFY')
      message.publish();
    })

    return model;
  })
}
const tryRegister = (callback) => {
  esClient.ping({
    // ping usually has a 3000ms timeout
    requestTimeout: 1000
  }, function (error) {
    if (error) {
      //TODO: google how to set this to execute immediately
      setTimeout(callback, 1000)
    } else {
      callback()
    }
  });
}
tryRegister(registerElasticPlugin)
const Hook = mongoose.model('Hook', HookSchema)

export default Hook;
