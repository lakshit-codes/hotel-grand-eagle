const { MongoClient } = require('mongodb');
require('dotenv').config();

async function listDbs() {
  const uri = "mongodb+srv://deepakr_db_user:4oYOhDfezDMn2jCN@kalpcluster.mr8bacs.mongodb.net/";
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const dbs = await client.db().admin().listDatabases();
    console.log(dbs.databases.map(db => db.name).join('\n'));
  } finally {
    await client.close();
  }
}
listDbs();
