const { MongoClient } = require('mongodb');
require('dotenv').config();

async function checkFullDoc() {
  const uri = "mongodb+srv://deepakr_db_user:4oYOhDfezDMn2jCN@kalpcluster.mr8bacs.mongodb.net/";
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("kalp_tenant_furni");
    const doc = await db.collection("products").findOne({ sku: "TEST-1" });
    console.log(JSON.stringify(doc, null, 2));
  } finally {
    await client.close();
  }
}
checkFullDoc();
