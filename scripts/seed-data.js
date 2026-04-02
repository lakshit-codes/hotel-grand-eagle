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
  { name: "JECC JAIPUR", distance: "2.3 KM", description: "Jaipur Exhibition & Convention Centre, the region's largest integrated convention center." },
  { name: "MAHATMA GANDHI HOSPITAL", distance: "2.6 KM", description: "Premier multi-specialty healthcare provider in Sitapura." },
  { name: "BOMBAY HOSPITAL", distance: "3.1 KM", description: "Advanced medical facility offering comprehensive specialized care." },
  { name: "CHATRALA CIRCLE", distance: "500 MTR", description: "The central hub of Sitapura Industrial Area, just a short walk away." },
  { name: "JAIPUR INTERNATIONAL AIRPORT", distance: "10 KM", description: "Easily accessible international gateway connecting Jaipur to the world." },
  { name: "AKSHAYA PATRA TEMPLE", distance: "4.8 KM", description: "A divine architectural marvel and spiritual center dedicated to Lord Krishna." },
  { name: "INDIA GATE", distance: "2.3 KM", description: "A popular local landmark and meeting point in the heart of Sitapura." }
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

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await client.close();
  }
}

seed();
