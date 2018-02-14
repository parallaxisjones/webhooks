import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { trigger } from './controller'

import { token } from '../../services/passport'

const router = new Router()

router.post('/',
  token({required: false}),
  body({
    type: {
      type: String
    },
    properties: {
      type: Object,
    },
    repository: {
      type: Object,
    }
  }),
  trigger)

export {router}
