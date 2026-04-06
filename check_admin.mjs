import fs from 'fs';
const envFile = fs.readFileSync('.env', 'utf-8');
const mongoUriMatch = envFile.match(/MONGODB_URI=(.*)/);
const mongoDbMatch = envFile.match(/MONGODB_DB=(.*)/);

const MONGODB_URI = mongoUriMatch ? mongoUriMatch[1].trim().replace(/^"|"$/g, '') : null;
const MONGODB_DB = mongoDbMatch ? mongoDbMatch[1].trim().replace(/^"|"$/g, '') : null;

import { MongoClient } from 'mongodb';

(async () => {
  if (!MONGODB_URI) return;
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(MONGODB_DB);
  
  const admins = await db.collection('users').find({ role: 'admin' }).toArray();
  
  if (admins.length === 0) {
    console.log('No admins found. Creating one...');
    const bcrypt = await import('bcryptjs');
    const salt = await bcrypt.default.genSalt(10);
    const hashedPassword = await bcrypt.default.hash('admin123', salt);
    
    await db.collection('users').insertOne({
        name: 'Admin User',
        email: 'admin@hotelgrandeagle.com',
        phone: null,
        password: hashedPassword,
        role: 'admin',
        createdAt: new Date()
    });
    console.log('Created admin with email: admin@hotelgrandeagle.com, password: admin123');
  } else {
    console.log('Admins found:');
    admins.forEach(u => console.log('Email:', u.email, 'Phone:', u.phone, 'Role:', u.role));
  }
  
  await client.close();
})();
