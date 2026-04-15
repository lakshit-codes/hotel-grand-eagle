const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://cs530885_db_user:uhKijf1PLxANW4pv@cluster0.yctt4gm.mongodb.net/tours_travel?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function checkHome() {
  try {
    await client.connect();
    const db = client.db('hotel_management');
    const page = await db.collection('pages').findOne({ slug: 'home' });
    console.log(JSON.stringify(page, null, 2));
  } finally {
    await client.close();
  }
}
checkHome();
