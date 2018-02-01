import elasticsearch from 'elasticsearch'

const esClient = new elasticsearch.Client({
  host: process.env.ES_CLIENT,
  indexAutomatically: false
})

export default esClient
