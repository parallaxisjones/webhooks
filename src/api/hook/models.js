import mongoose, { Schema } from 'mongoose'
import mongoosastic from 'mongoosastic'
import logger from '../../services/winston'
const producer = require('../../services/kafka/producer');
let seeder = require('../../services/seeder')
const uuidV1 = require('uuid/v1');
import StreamMessage from './streamMessage';
import KafkaRest from 'kafka-rest';
//TODO: Make a script header
//
//TODO: clean up console logs when finished
// TODO: ESLint setup
//
// IDEA: build a directory watcher service that creates todos and such

const HOOK_NOTIFY  = 'HOOK_NOTIFY';
let hookAvroSchema = new KafkaRest.AvroSchema({
    name: "Webhook",
    type: "record",
    fields: [
        { name: "id", "type": "string" },
        { name: "type", "type": "string" },
        { name: "properties", type: "map", values: "string" },
        { name: "fireCounter", "type": "int" },
        { name: "lastFired", "type": "string" },
      ]
});
const HOOK_SCHEMA = {
  type: {
    type: String,
    defaultValue: 'action'
  },
  properties: {
    type: Object
  },
  fireCounter: {
    type: Number,
    defaultValue: 0
  },
  lastFired: {
    type: Date
  }
}
const HOOK_SCHEMA_OPTIONS = {
  timestamps: true
}

const HOOK_METHODS = {
  updateCounter(){
    this.fireCounter = this.fireCounter ? this.fireCounter + 1 : 1;
    this.lastFired = Date.now();
    return this.save().then(doc => {
      return doc
    });
  },
  report(err = null, results){
    return new StreamMessage(err ? err : results || 'empty results', 'webhooks-report').publish();
  },
  fire(){
    // NOTE: producer logic lives in stream message, to produce a new one do this:
    const hook = this.toJSON()

    const topic = hook.type && hook.type ? hook.type : HOOK_NOTIFY
    const message = new StreamMessage({
      schema: hookAvroSchema,
      topic
    })

    message.publish(hook);
  },
  view (full) {
    const view = {
      type: this.type,
      ...this.properties
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

HookSchema.post('save', doc => doc.fire())

const Hook = mongoose.model('Hook', HookSchema)

export default Hook;
