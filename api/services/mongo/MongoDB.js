import mongo from '../../../mongo';

class MongoDB {
  async find(table, tconst) {
    mongo((client) => {
      const db = client.db('tvratings');
      const collection = db.collection(table);

      collection
        .findOne({ imdb_id: tconst })
        .then(function (result) {
          client.close();

          return result;
        })
        .catch((err) => {
          console.log('err', err);
        });
    });
  }

  async insertOne(table, json) {
    mongo((client) => {
      const db = client.db('tvratings');
      const collection = db.collection(table);

      collection
        .insertOne(json)
        .then(function (result) {
          client.close();

          return result;
        })
        .catch((err) => {
          console.log('err', err);
        });
    });
  }
}

export default new MongoDB();
