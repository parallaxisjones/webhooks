// const seedUpdate = (type, nodeProto) => {
//   // model configuration
//   // run node type seeders
//   const OPTIONS = {upsert: true, new: true, runValidators: true}
//
//   const onUpdateComplete = (err, doc) => { // callback
//     if (err) {
//       return logger.error(err)
//     }
//     // POST_SAVE_HOOK(doc, doc.isNew || true)
//     logger.info(doc)
//   }
//
//   Node.findOneAndUpdate(
//     {
//       type: nodeProto.type,
//       index: nodeProto.index,
//       'properties.type': type
//     }, // find a document with that filter
//     {
//       properties: {
//         type,
//         ...nodeProto.properties
//       },
//       type: nodeProto.type
//     }, // document to insert when nothing was found
//     OPTIONS, // options
//     onUpdateComplete)
// }
//
// if (process.env.SEED_TYPES) {
//   // seeder.run(seedUpdate)
// }
