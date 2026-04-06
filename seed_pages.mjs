import fs from 'fs';
const envFile = fs.readFileSync('.env', 'utf-8');
const mongoUriMatch = envFile.match(/MONGODB_URI=(.*)/);
const mongoDbMatch = envFile.match(/MONGODB_DB=(.*)/);
const MONGODB_URI = mongoUriMatch ? mongoUriMatch[1].trim().replace(/^"|"$/g, '') : null;
const MONGODB_DB = mongoDbMatch ? mongoDbMatch[1].trim().replace(/^"|"$/g, '') : null;

import { MongoClient } from 'mongodb';

const INITIAL_PAGES = [
    {
        id: "pg_about_us",
        title: "About Us",
        slug: "about-us",
        content: "Welcome to Hotel Grand Eagle, a sanctuary of luxury and heritage in the heart of Jaipur. Our hotel blends traditional Rajasthani hospitality with modern luxury, offering an unforgettable experience for every traveler.\n\nFrom our beautifully designed rooms to our world-class dining, every detail of your stay is carefully curated to provide the ultimate comfort and elegance.",
        isPublished: true,
    },
    {
        id: "pg_privacy_policy",
        title: "Privacy Policy",
        slug: "privacy-policy",
        content: "At Hotel Grand Eagle, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information when you use our website or visit our property.\n\nWe collect information such as your name, contact details, and payment information to facilitate your bookings and improve our services. We do not sell your personal data to third parties.",
        isPublished: true,
    },
    {
        id: "pg_our_facilities",
        title: "Our Facilities",
        slug: "facilities",
        content: "Enjoy a range of premium facilities at Hotel Grand Eagle:\n\n- Rooftop Infinity Pool with a view of the city\n- Full-service Luxury Spa and Wellness Center\n- Multi-cuisine Fine Dining Restaurant\n- State-of-the-art Fitness Center\n- 24/7 Concierge and Room Service\n- High-speed Wi-Fi throughout the property",
        isPublished: true,
    }
];

(async () => {
    if (!MONGODB_URI) { console.log("No MONGODB_URI"); return; }
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db(MONGODB_DB);

    // Seed pages
    const existingPages = await db.collection("pages").countDocuments();
    if (existingPages === 0) {
        const now = new Date().toISOString();
        const docs = INITIAL_PAGES.map(pg => ({ ...pg, createdAt: now, updatedAt: now }));
        await db.collection("pages").insertMany(docs);
        console.log(`✅ Seeded ${docs.length} initial pages`);
    } else {
        console.log(`Pages already has ${existingPages} entries, skipping seed.`);
    }

    await client.close();
    console.log("Done!");
})();
