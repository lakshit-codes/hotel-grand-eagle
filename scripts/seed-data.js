const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Basic .env parser
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  console.log(`Loading .env from ${envPath}...`);
  if (fs.existsSync(envPath)) {
    const env = fs.readFileSync(envPath, 'utf8');
    env.split(/\r?\n/).forEach(line => {
      const parts = line.split('=');
      const key = parts[0] ? parts[0].trim() : null;
      const value = parts.slice(1).join('=') ? parts.slice(1).join('=').trim() : null;
      if (key && value) {
        // Remove quotes and any trailing hidden characters
        process.env[key] = value.replace(/^["']|["']$/g, '').trim();
      }
    });
  } else {
    console.warn(".env file not found!");
  }
}

loadEnv();

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'hotel_management';

if (!uri) {
  console.error("MONGODB_URI not found in .env");
  process.exit(1);
}

const nearbyPlaces = [
  { name: "JECC JAIPUR", distance: "2.3 KM", lat: 26.7828, lng: 75.8351, description: "Jaipur Exhibition & Convention Centre, the region's largest integrated convention center." },
  { name: "MAHATMA GANDHI HOSPITAL", distance: "2.6 KM", lat: 26.7645, lng: 75.8234, description: "Premier multi-specialty healthcare provider in Sitapura." },
  { name: "BOMBAY HOSPITAL", distance: "3.1 KM", lat: 26.7850, lng: 75.8430, description: "Advanced medical facility offering comprehensive specialized care." },
  { name: "CHATRALA CIRCLE", distance: "500 MTR", lat: 26.7795, lng: 75.8110, description: "The central hub of Sitapura Industrial Area, just a short walk away." },
  { name: "JAIPUR INTERNATIONAL AIRPORT", distance: "10 KM", lat: 26.8300, lng: 75.8050, description: "Easily accessible international gateway connecting Jaipur to the world." },
  { name: "AKSHAYA PATRA TEMPLE", distance: "4.8 KM", lat: 26.8150, lng: 75.8350, description: "A divine architectural marvel and spiritual center dedicated to Lord Krishna." },
  { name: "INDIA GATE", distance: "2.3 KM", lat: 26.7870, lng: 75.8340, description: "A popular local landmark and meeting point in the heart of Sitapura." }
].map((p, i) => ({
  id: `np_${Date.now()}_${i}`,
  ...p,
  image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=60",
  createdAt: new Date().toISOString()
}));

const roomTypes = [
  {
    id: "rt_deluxe",
    roomName: "Deluxe Room",
    slug: "deluxe-room",
    roomCategory: "Standard Collection",
    bedType: "King or Twin",
    maxOccupancy: 2,
    roomSize: 35,
    view: "City View",
    smokingPolicy: "Non-smoking",
    balconyAvailable: false,
    basePrice: 4999,
    extraBedPrice: 1000,
    refundable: true,
    currency: "INR",
    amenityIds: [],
    images: ["https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=800"]
  },
  {
    id: "rt_junior_suite",
    roomName: "Junior Suite",
    slug: "junior-suite",
    roomCategory: "Signature Collection",
    bedType: "Super King",
    maxOccupancy: 3,
    roomSize: 55,
    view: "Pool View",
    smokingPolicy: "Non-smoking",
    balconyAvailable: true,
    basePrice: 7499,
    extraBedPrice: 1500,
    refundable: true,
    currency: "INR",
    amenityIds: [],
    images: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800"]
  },
  {
    id: "rt_executive",
    roomName: "Executive Suite",
    slug: "executive-suite",
    roomCategory: "Prestige Collection",
    bedType: "Super King",
    maxOccupancy: 3,
    roomSize: 80,
    view: "Panoramic",
    smokingPolicy: "Non-smoking",
    balconyAvailable: true,
    basePrice: 12999,
    extraBedPrice: 2000,
    refundable: true,
    currency: "INR",
    amenityIds: [],
    images: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=800"]
  },
  {
    id: "rt_presidential",
    roomName: "Presidential Suite",
    slug: "presidential-suite",
    roomCategory: "Pinnacle Collection",
    bedType: "Emperor King",
    maxOccupancy: 4,
    roomSize: 130,
    view: "360° View",
    smokingPolicy: "Non-smoking",
    balconyAvailable: true,
    basePrice: 22000,
    extraBedPrice: 3000,
    refundable: true,
    currency: "INR",
    amenityIds: [],
    images: ["https://images.unsplash.com/photo-1590490359683-658d3d23f972?q=80&w=800"]
  }
];

const inventoryRooms = [
  { roomNumber: "101", roomTypeId: "rt_deluxe", roomTypeName: "Deluxe Room", floor: 1 },
  { roomNumber: "102", roomTypeId: "rt_deluxe", roomTypeName: "Deluxe Room", floor: 1 },
  { roomNumber: "201", roomTypeId: "rt_junior_suite", roomTypeName: "Junior Suite", floor: 2 },
  { roomNumber: "301", roomTypeId: "rt_executive", roomTypeName: "Executive Suite", floor: 3 },
  { roomNumber: "401", roomTypeId: "rt_presidential", roomTypeName: "Presidential Suite", floor: 4 }
].map(r => ({
  id: `room_${r.roomNumber}`,
  ...r,
  status: "available",
  isActive: true,
  features: [],
  notes: "",
  lastCleaned: new Date().toISOString().slice(0, 10),
  createdAt: new Date().toISOString()
}));

const cmsPages = [
  {
    id: "pg_terms",
    slug: "terms-and-conditions",
    title: "Terms & Conditions",
    subtitle: "Rules & Regulations",
    isPublished: true,
    sections: [
      {
        id: "l1",
        type: "legal-block",
        heading: "1. Acceptance of Terms",
        description: "By accessing and using Hotel Grand Eagle's services, you agree to be bound by these terms. If you do not agree, please refrain from using our website or booking services."
      },
      {
        id: "l2",
        type: "legal-block",
        heading: "2. Booking Policy",
        description: "All bookings are subject to availability. A valid ID proof (Aadhar for Indians, Passport for Foreigners) is mandatory at the time of check-in."
      }
    ],
    content: [],
    metaTitle: "Terms & Conditions | Hotel Grand Eagle",
    metaDescription: "Read the official terms and conditions for staying at Hotel Grand Eagle, Jaipur.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "pg_privacy",
    slug: "privacy-policy",
    title: "Privacy Policy",
    subtitle: "Your Data Security",
    isPublished: true,
    sections: [
      {
        id: "p1",
        type: "legal-block",
        heading: "Information Collection",
        description: "We collect only the necessary information required for your booking and stay, such as name, contact details, and ID proofs as per local regulations."
      },
      {
        id: "p2",
        type: "legal-block",
        heading: "Data Protection",
        description: "Hotel Grand Eagle employs industry-standard security measures to protect your personal information from unauthorized access or disclosure."
      }
    ],
    content: [],
    metaTitle: "Privacy Policy | Hotel Grand Eagle",
    metaDescription: "Learn how Hotel Grand Eagle protects your personal information and stays compliant with data laws.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

async function seed() {
  const client = new MongoClient(uri);
  try {
    console.log("Connecting to MongoDB...");
    await client.connect();
    const db = client.db(dbName);
    console.log(`Connected to database: ${dbName}`);

    // Seed Nearby Places
    console.log("Clearing nearby collection...");
    await db.collection("nearby").deleteMany({});
    console.log("Seeding nearby places...");
    await db.collection("nearby").insertMany(nearbyPlaces);
    console.log(`Seeded ${nearbyPlaces.length} nearby places.`);

    // Seed Room Types
    console.log("Clearing room_types collection...");
    await db.collection("room_types").deleteMany({});
    console.log("Seeding room types...");
    await db.collection("room_types").insertMany(roomTypes);
    console.log(`Seeded ${roomTypes.length} room types.`);

    // Seed Room Inventory
    console.log("Clearing rooms collection...");
    await db.collection("rooms").deleteMany({});
    console.log("Seeding room inventory...");
    await db.collection("rooms").insertMany(inventoryRooms);
    console.log(`Seeded ${inventoryRooms.length} room inventory docs.`);

    // Seed CMS Pages
    console.log("Seeding legal pages...");
    for (const page of cmsPages) {
      await db.collection("pages").updateOne(
        { slug: page.slug },
        { $set: page },
        { upsert: true }
      );
    }
    console.log("CMS legal pages ensured.");

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await client.close();
  }
}

seed();
