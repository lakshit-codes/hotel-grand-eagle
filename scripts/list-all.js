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

async function listAll() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const admin = client.db().admin();
    const dbs = await admin.listDatabases();
    console.log("Databases:", dbs.databases.map(d => d.name));

    for (const d of dbs.databases) {
      if (['admin', 'local', 'config'].includes(d.name)) continue;
      const db = client.db(d.name);
      const colls = await db.listCollections().toArray();
      console.log(`DB ${d.name} Collections:`, colls.map(c => c.name));
      for (const c of colls) {
        const count = await db.collection(c.name).countDocuments();
        console.log(`  - ${c.name}: ${count} docs`);
      }
    }
  } catch (error) {
    console.error("List failed:", error);
  } finally {
    await client.close();
  }
}

listAll();
