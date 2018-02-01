import express from 'express'
import cors from 'cors'
import compression from 'compression'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import { errorHandler as queryErrorHandler } from 'querymen'
import { errorHandler as bodyErrorHandler } from 'bodymen'
import { env } from '../../config'

export default (routes, queue) => {
  const app = express()
  app.use((req, res, next) => {
    console.log('got the thing');
    return (req.queue = queue) && next(null)
  })
  /* istanbul ignore next */
  if (env === 'production' || env === 'development') {
    app.use(cors())
    app.use(compression())
    app.use(morgan('dev'))
  }

  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  app.use(routes)
  app.use(queryErrorHandler())
  app.use(bodyErrorHandler())

  app.use(function (err, req, res, next) {

    if (err) {
      res.status(err.status || 500)
      switch (env) {
        case 'production':
          return res.send({
            message: err.message,
            error: {}
          })
        default:
          return res.send({
            message: err.message,
            error: err
          })
      }
    }
  })
  app.get('/healthz', function(req, res, next){
    return res.status(200).send()
  })
  return app
}
