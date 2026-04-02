const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const env = fs.readFileSync(envPath, 'utf8');
    env.split(/\r?\n/).forEach(line => {
      const parts = line.split('=');
      const key = parts[0] ? parts[0].trim() : null;
      const value = parts.slice(1).join('=') ? parts.slice(1).join('=').trim() : null;
      if (key && value) {
        process.env[key] = value.replace(/^["']|["']$/g, '').trim();
      }
    });
  }
}

loadEnv();

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

async function check() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const colls = await db.listCollections().toArray();
    console.log(`DB NAME: |${dbName}|`);
    console.log(`Collections in |${dbName}|:`, colls.map(c => c.name));
  } finally {
    await client.close();
  }
}

check();
