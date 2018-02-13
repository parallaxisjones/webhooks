import logger from '../services/winston';
import http from 'http'
import { env, mongo, port, ip } from '../config'
import mongoose from '../services/mongoose'
import express from '../services/express'
import api from '../api'


/**
 * export default - master listner.
 * this is mad easy, all it does is start the express server configured in '../services/express'
 *
 * @param  {Queue} queue this is the job queue that get's made in the init process,
 *                       we need to give it to the express server scope
 */
export default function(queue){
  const app = express(api, queue)
  const server = http.createServer(app)
  // TODO: find out why this is happening, why do we need setImmediate? do we need it?
  setImmediate(() => {
    server.listen(port, ip, () => {

      console.log('Express server listening on http://%s:%d, in %s mode', ip, port, env)
    })
  })
}
