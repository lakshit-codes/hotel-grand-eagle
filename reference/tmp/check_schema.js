const { MongoClient } = require('mongodb');
require('dotenv').config();

async function checkSchema() {
  const uri = "mongodb+srv://deepakr_db_user:4oYOhDfezDMn2jCN@kalpcluster.mr8bacs.mongodb.net/";
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("kolp_tenant_goodyearbiketires");
    const products = db.collection("products");
    const doc = await products.findOne({});
    console.log(JSON.stringify(doc, null, 2));
  } finally {
    await client.close();
  }
}
checkSchema();
