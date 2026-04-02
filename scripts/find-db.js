const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const env = fs.readFileSync(envPath, 'utf8');
    env.split('\n').forEach(line => {
      const parts = line.split('=');
      const key = parts[0] ? parts[0].trim() : null;
      const value = parts.slice(1).join('=') ? parts.slice(1).join('=').trim() : null;
      if (key && value) {
        process.env[key] = value.replace(/^["']|["']$/g, '');
      }
    });
  }
}

loadEnv();

const uri = process.env.MONGODB_URI;

async function findCollections() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const admin = client.db().admin();
    const dbs = await admin.listDatabases();
    
    for (const d of dbs.databases) {
      const db = client.db(d.name);
      const colls = await db.listCollections().toArray();
      const names = colls.map(c => c.name);
      if (names.includes('room_types') || names.includes('nearby')) {
        console.log(`FOUND IN DB: ${d.name}`);
        console.log(`Collections: ${names.join(', ')}`);
      }
    }
  } finally {
    await client.close();
  }
}

findCollections();
