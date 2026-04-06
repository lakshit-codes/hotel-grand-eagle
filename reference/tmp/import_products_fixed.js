const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://deepakr_db_user:4oYOhDfezDMn2jCN@kalpcluster.mr8bacs.mongodb.net/";
const dbName = "kalp_tenant_furni";

const furnitureProducts = [
  {
    name: "Luxury Fabric Sofa",
    sku: "SOFA-101",
    slug: "luxury-fabric-sofa",
    description: "Premium 3 seater fabric sofa",
    status: "active",
    type: "physical",
    categoryIds: ["sofas"],
    primaryCategoryId: "sofas",
    attributeSetIds: ["specification"],
    pricing: {
      price: 65000,
      compareAtPrice: 0,
      costPerItem: 0,
      chargeTax: true,
      trackQuantity: true,
      currency: "INR" 
    },
    options: [], 
    gallery: ["https://images.unsplash.com/photo-1582582429416-8d9f0c5b7c1b", "https://images.unsplash.com/photo-1567016432779-094069958ea5"],
    primaryImageId: "https://images.unsplash.com/photo-1582582429416-8d9f0c5b7c1b",
    relatedProductIds: [],
    templateKey: "product-split",
    price: 65000,
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
    attributeSetIds: ["specification"],
    pricing: {
      price: 48000,
      compareAtPrice: 0,
      costPerItem: 0,
      chargeTax: true,
      trackQuantity: true,
      currency: "INR" 
    },
    options: [],
    gallery: ["https://images.unsplash.com/photo-1598300056393-4aac492f4344", "https://images.unsplash.com/photo-1616628182506-7e2b2c2e4e7d"],
    primaryImageId: "https://images.unsplash.com/photo-1598300056393-4aac492f4344",
    relatedProductIds: [],
    templateKey: "product-split",
    price: 48000,
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
    attributeSetIds: ["specification"],
    pricing: {
      price: 22000,
      compareAtPrice: 0,
      costPerItem: 0,
      chargeTax: true,
      trackQuantity: true,
      currency: "INR" 
    },
    options: [],
    gallery: ["https://images.unsplash.com/photo-1503602642458-232111445657", "https://images.unsplash.com/photo-1519710164239-da123dc03ef4"],
    primaryImageId: "https://images.unsplash.com/photo-1503602642458-232111445657",
    relatedProductIds: [],
    templateKey: "product-split",
    price: 22000,
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
    attributeSetIds: ["specification"],
    pricing: {
      price: 35000,
      compareAtPrice: 0,
      costPerItem: 0,
      chargeTax: true,
      trackQuantity: true,
      currency: "INR" 
    },
    options: [],
    gallery: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"],
    primaryImageId: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7",
    relatedProductIds: [],
    templateKey: "product-split",
    price: 35000,
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
    attributeSetIds: ["specification"],
    pricing: {
      price: 18000,
      compareAtPrice: 0,
      costPerItem: 0,
      chargeTax: true,
      trackQuantity: true,
      currency: "INR" 
    },
    options: [],
    gallery: ["https://images.unsplash.com/photo-1493666438817-866a91353ca9", "https://images.unsplash.com/photo-1555041469-a586c61ea9bc"],
    primaryImageId: "https://images.unsplash.com/photo-1493666438817-866a91353ca9",
    relatedProductIds: [],
    templateKey: "product-split",
    price: 18000,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("products");

    // Clean up previous attempts
    const skus = furnitureProducts.map(p => p.sku);
    const delResult = await collection.deleteMany({ sku: { $in: skus } });
    console.log(`Cleaned up ${delResult.deletedCount} existing products.`);

    // Re-import with corrected schema
    const insResult = await collection.insertMany(furnitureProducts);
    console.log(`${insResult.insertedCount} products re-imported successfully.`);

  } finally {
    await client.close();
  }
}
run();
