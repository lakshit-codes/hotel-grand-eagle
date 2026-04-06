const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://deepakr_db_user:4oYOhDfezDMn2jCN@kalpcluster.mr8bacs.mongodb.net/";
const dbName = "kalp_tenant_furni";

const products = [
  {
    name: "Luxury Fabric Sofa",
    sku: "SOFA-101",
    slug: "luxury-fabric-sofa",
    description: "Premium 3 seater fabric sofa",
    status: "active",
    type: "physical",
    categoryIds: ["sofas"],
    primaryCategoryId: "sofas",
    price: 65000,
    pricing: { price: 65000, currency: "INR" },
    primaryImageId: "https://images.unsplash.com/photo-1582582429416-8d9f0c5b7c1b",
    gallery: ["https://images.unsplash.com/photo-1582582429416-8d9f0c5b7c1b", "https://images.unsplash.com/photo-1567016432779-094069958ea5"],
    rating: 5,
    tag: "Bestseller",
    templateKey: "product-split",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Wooden Sofa Cum Bed",
    sku: "BED-201",
    slug: "wooden-sofa-cum-bed",
    description: "Convertible wooden sofa bed",
    status: "active",
    type: "physical",
    categoryIds: ["sofa-cum-bed"],
    primaryCategoryId: "sofa-cum-bed",
    price: 48000,
    pricing: { price: 48000, currency: "INR" },
    primaryImageId: "https://images.unsplash.com/photo-1598300056393-4aac492f4344",
    gallery: ["https://images.unsplash.com/photo-1598300056393-4aac492f4344", "https://images.unsplash.com/photo-1616628182506-7e2b2c2e4e7d"],
    rating: 4,
    tag: "New",
    templateKey: "product-split",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Modern Lounge Chair",
    sku: "CHAIR-301",
    slug: "modern-lounge-chair",
    description: "Comfortable lounge chair",
    status: "active",
    type: "physical",
    categoryIds: ["seating"],
    primaryCategoryId: "seating",
    price: 22000,
    pricing: { price: 22000, currency: "INR" },
    primaryImageId: "https://images.unsplash.com/photo-1503602642458-232111445657",
    gallery: ["https://images.unsplash.com/photo-1503602642458-232111445657", "https://images.unsplash.com/photo-1519710164239-da123dc03ef4"],
    rating: 5,
    tag: "Trending",
    templateKey: "product-split",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Premium Recliner",
    sku: "REC-401",
    slug: "premium-recliner",
    description: "Luxury recliner chair",
    status: "active",
    type: "physical",
    categoryIds: ["recliners"],
    primaryCategoryId: "recliners",
    price: 35000,
    pricing: { price: 35000, currency: "INR" },
    primaryImageId: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7",
    gallery: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"],
    rating: 4,
    tag: "Classic",
    templateKey: "product-split",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Accent Chair",
    sku: "CHAIR-302",
    slug: "accent-chair",
    description: "Stylish accent chair",
    status: "active",
    type: "physical",
    categoryIds: ["seating"],
    primaryCategoryId: "seating",
    price: 18000,
    pricing: { price: 18000, currency: "INR" },
    primaryImageId: "https://images.unsplash.com/photo-1493666438817-866a91353ca9",
    gallery: ["https://images.unsplash.com/photo-1493666438817-866a91353ca9", "https://images.unsplash.com/photo-1555041469-a586c61ea9bc"],
    rating: 4,
    tag: "New",
    templateKey: "product-split",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const result = await db.collection("products").insertMany(products);
    console.log(`${result.insertedCount} products inserted.`);
  } finally {
    await client.close();
  }
}
run();
