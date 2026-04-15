const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://cs530885_db_user:uhKijf1PLxANW4pv@cluster0.yctt4gm.mongodb.net/tours_travel?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function checkLegalPages() {
  try {
    await client.connect();
    const db = client.db('hotel_management');
    const pages = await db.collection('pages').find({ slug: { $in: ['terms-and-conditions', 'privacy-policy'] } }).toArray();
    console.log(JSON.stringify(pages, null, 2));
  } finally {
    await client.close();
  }
}
checkLegalPages();
