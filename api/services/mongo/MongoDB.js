import mongo from '../../../mongo';

class MongoDB {
  async find (table, tconst) {
    mongo((client) => {
      const db = client.db('tvratings'),
        collection = db.collection(table);

      console.log('Ola')

      collection
        .findOne({tconst: tconst})
        .then(function (result) {
          client.close();

          return result;
        })
        .catch((err) => {
          console.log('err', err);
        });
    });
  }

  async insertOne (table, json) {
    mongo((client) => {
      const db = client.db('tvratings'),
        collection = db.collection(table);

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
