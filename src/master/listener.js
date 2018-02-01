import logger from '../services/winston';
import http from 'http'
import { env, mongo, port, ip } from '../config'
import mongoose from '../services/mongoose'
import express from '../services/express'
import api from '../api'
export default function(queue){
  const app = express(api, queue)
  const server = http.createServer(app)
  setImmediate(() => {
    server.listen(port, ip, () => {

      console.log('Express server listening on http://%s:%d, in %s mode', ip, port, env)
    })
  })
}
