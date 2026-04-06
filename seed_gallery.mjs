import fs from 'fs';
const envFile = fs.readFileSync('.env', 'utf-8');
const mongoUriMatch = envFile.match(/MONGODB_URI=(.*)/);
const mongoDbMatch = envFile.match(/MONGODB_DB=(.*)/);
const MONGODB_URI = mongoUriMatch ? mongoUriMatch[1].trim().replace(/^"|"$/g, '') : null;
const MONGODB_DB = mongoDbMatch ? mongoDbMatch[1].trim().replace(/^"|"$/g, '') : null;

import { MongoClient } from 'mongodb';

const GALLERY_IMAGES = [
    { id: "gal_1", url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800", label: "Grand Lobby", order: 0 },
    { id: "gal_2", url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800", label: "Infinity Pool", order: 1 },
    { id: "gal_3", url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800", label: "Dining Hall", order: 2 },
    { id: "gal_4", url: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=800", label: "Spa Sanctuary", order: 3 },
    { id: "gal_5", url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800", label: "Garden Suite", order: 4 },
    { id: "gal_6", url: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1200", label: "Luxury Suite", order: 5 },
    { id: "gal_7", url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1200", label: "Executive Room", order: 6 },
    { id: "gal_8", url: "https://images.unsplash.com/photo-1590490359683-658d3d23f972?q=80&w=1200", label: "Lounge Area", order: 7 },
    { id: "gal_9", url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1200", label: "Pool Deck", order: 8 },
    { id: "gal_10", url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1200", label: "Deluxe Room", order: 9 },
    { id: "gal_11", url: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=1200", label: "Beach View", order: 10 },
    { id: "gal_12", url: "https://images.unsplash.com/photo-1551882547-ff43c63efe81?q=80&w=1200", label: "Night View", order: 11 },
];

(async () => {
    if (!MONGODB_URI) { console.log("No MONGODB_URI"); return; }
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db(MONGODB_DB);

    // Seed gallery
    const existingGallery = await db.collection("gallery").countDocuments();
    if (existingGallery === 0) {
        const now = new Date().toISOString();
        const docs = GALLERY_IMAGES.map(img => ({ ...img, createdAt: now }));
        await db.collection("gallery").insertMany(docs);
        console.log(`✅ Seeded ${docs.length} gallery images`);
    } else {
        console.log(`Gallery already has ${existingGallery} images, skipping seed.`);
    }

    await client.close();
    console.log("Done!");
})();
