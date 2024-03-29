const mongoClient = require('mongodb').MongoClient

module.exports = function (callback) {
  const url = 'mongodb://mongo:27017';
  mongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, function (err, client) {
    const res = (err) ? err : client
    return callback(res)
  })
}
