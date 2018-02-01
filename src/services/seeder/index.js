import TYPES from '../../schema/types';

module.exports.run = function (worker) {
  for (var t in TYPES) {
    if (TYPES.hasOwnProperty(t)) {
      worker(t, TYPES[t])
    }
  }
}
