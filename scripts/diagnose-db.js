const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const env = fs.readFileSync(envPath, 'utf8');
    env.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, '');
      }
    });
  }
}

loadEnv();

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'hotel_management';

async function diagnose() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const collections = await db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));

    for (const coll of collections) {
      const count = await db.collection(coll.name).countDocuments();
      console.log(`Collection ${coll.name} has ${count} documents.`);
      if (count > 0) {
        const doc = await db.collection(coll.name).findOne();
        console.log(`Sample document from ${coll.name}:`, JSON.stringify(doc, null, 2));
      }
    }
  } catch (error) {
    console.error("Diagnosis failed:", error);
  } finally {
    await client.close();
  }
}

diagnose();
