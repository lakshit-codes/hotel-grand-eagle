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
const dbName = process.env.MONGODB_DB;

async function checkApi() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    console.log(`Checking DB: ${dbName}`);
    const rooms = await db.collection("room_types").find({}).toArray();
    console.log(`Found ${rooms.length} room types.`);
    console.log("Sample:", JSON.stringify(rooms[0], null, 2));
  } catch (error) {
    console.error("API check failed:", error);
  } finally {
    await client.close();
  }
}

checkApi();
