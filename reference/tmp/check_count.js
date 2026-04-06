const { MongoClient } = require('mongodb');
require('dotenv').config();

async function checkCount() {
  const uri = "mongodb+srv://deepakr_db_user:4oYOhDfezDMn2jCN@kalpcluster.mr8bacs.mongodb.net/";
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("kalp_tenant_furni");
    const count = await db.collection("products").countDocuments();
    console.log(`Total products in kalp_tenant_furni: ${count}`);
    const docs = await db.collection("products").find({}).limit(10).toArray();
    docs.forEach(doc => console.log(`- ${doc.name} (SKU: ${doc.sku})`));
  } finally {
    await client.close();
  }
}
checkCount();
