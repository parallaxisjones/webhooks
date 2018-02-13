// TODO: REMOVE ME

// function immutableField(field) {
//   return function(value) {
//     return this[field] || value;
//   };
// }
//
// function immutableFieldPlugin(schema) {
//   var props = schema.tree;
//   Object.keys(props).forEach(function(prop) {
//     if (props[prop].immutable) {
//       schema.path(prop).set(immutableField(prop));
//     }
//   });
//   schema.pre('save', function (next) { this.increment(); next(); })
// };
//
// export default immutableFieldPlugin;
