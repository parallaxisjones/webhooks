import express from 'express'
import cors from 'cors'
import compression from 'compression'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import { errorHandler as queryErrorHandler } from 'querymen'
import { errorHandler as bodyErrorHandler } from 'bodymen'
import { env } from '../../config'

export default (routes, queue) => {
  // NOTE: init express app
  const app = express();

  app.use((req, res, next) => {
    // NOTE: attach the work queue to the request so that we can haz jobs.
    return (req.queue = queue) && next(null)
  })

  // NOTE: configure webserver
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
      // TODO: implement more robust error handling and reporting.  we have the metrics server
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


  /**
   * register Health Check
   *
   * @param  {String} '/healthz'   endpoint path
   * @param  {Function} anonymous event handler, this only needs to return success
   * @param  {Request} req          the incoming request
   * @param  {Response} res          the outgoing response
   * @param  {Function} next         callback to call if this isn't the end of the line, if we're a middleware
   */
  app.get('/healthz', function(req, res, next){
    return res.status(200).send()
  })
  return app
}
