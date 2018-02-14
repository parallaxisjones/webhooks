import mongoose, { Schema } from 'mongoose'
import mongoosastic from 'mongoosastic'
import logger from '../../services/winston'
const producer = require('../../services/kafka/producer');
let seeder = require('../../services/seeder')
const uuidV1 = require('uuid/v1');
import StreamMessage from './streamMessage';

//TODO: Make a script header
//TODO: clean up console logs when finished
// TODO: ESLint setup
// IDEA: build a directory watcher service that creates todos and such

const HOOK_NOTIFY  = 'HOOK_NOTIFY';

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
  fire({ type, properties }){
    // console.log('fired data', type, properties);
    // const message = new StreamMessage(properties, type)
    // message.publish()
    return this.view(true)
  },
  view (full) {
    const view = {
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
  const hook = doc.view(true)
  const topic = hook.properties && hook.properties.type ? hook.properties.type : HOOK_NOTIFY
  const message = new StreamMessage(hook, [topic])
  // TODO: this should be implemented as doc.fire()
  message.publish((err, results) =>{
    console.log(results);
  });
  return doc
})

const Hook = mongoose.model('Hook', HookSchema)

export default Hook;
