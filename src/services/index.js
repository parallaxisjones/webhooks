import express from 'express'
import cors from 'cors'
import compression from 'compression'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import { errorHandler as queryErrorHandler } from 'querymen'
import { errorHandler as bodyErrorHandler } from 'bodymen'
import { env } from '../../config'
import logger from '../../services/winston'

export default (routes) => {
  const app = express()

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
      logger.error(`${err.status}:  ${err.message} | ${err.stack}`)
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
  return app
}
