const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://deepakr_db_user:4oYOhDfezDMn2jCN@kalpcluster.mr8bacs.mongodb.net/";
const dbName = "kalp_tenant_furni";

const wsCategories = [
  {
    key: "sofas",
    title: "Sofas",
    columns: [
      {
        sections: [
          {
            heading: "Sofa",
            links: [
              { title: "All Sofas" },
              { title: "Fabric Sofas" },
              { title: "Wooden Sofas" },
              { title: "3 Seater Sofas" },
              { title: "2 Seater Sofas" },
              { title: "1 Seater Sofas" },
              { title: "3+1+1 Sofa Sets" },
              { title: "Sofa Cum Beds" },
              { title: "L Shaped Sofas" },
              { title: "Chaise Loungers" },
              { title: "Outdoor Sofas" },
              { title: "Diwans" },
            ],
          },
        ],
      },
      {
        sections: [
          {
            heading: "Sofa Cum Bed",
            links: [
              { title: "All Sofa Cum Beds" },
              { title: "Wooden Sofa Cum Beds" },
              { title: "Fabric Sofa Cum Beds" },
            ],
          },
          {
            heading: "Recliners",
            links: [
              { title: "All Recliners" },
              { title: "1 Seater Recliners" },
              { title: "2 Seater Recliners" },
              { title: "3 Seater Recliners" },
            ],
          },
        ],
      },
      {
        sections: [
          {
            heading: "Seating",
            links: [
              { title: "Lounge Chairs" },
              { title: "Accent Chairs" },
              { title: "Arm Chair" },
              { title: "Wingback Chairs" },
              { title: "Bean Bags" },
              { title: "Loveseats" },
              { title: "Benches" },
              { title: "Ottomans" },
              { title: "Stools" },
            ],
          },
        ],
      },
    ]
  },
  {
    key: "living",
    title: "Living",
    columns: [
      {
        sections: [
          {
            heading: "All Sofas",
            links: [
              { title: "Fabric Sofas" },
              { title: "Wooden Sofas" },
              { title: "3 Seater Sofas" },
            ],
          },
          {
            heading: "Chairs",
            links: [
              { title: "All Chairs" },
              { title: "Lounge Chairs" },
              { title: "Arm Chairs" }
            ],
          },
        ],
      },
      {
        sections: [
          {
            heading: "Tables",
            links: [
              { title: "All Tables" },
              { title: "Coffee Tables" },
              { title: "Side Tables" }
            ],
          },
          {
            heading: "Living Storage",
            links: [
              { title: "Bookshelves" },
              { title: "Cabinet & Sideboards" }
            ],
          },
        ]
      }
    ]
  },
  {
    key: "bedroom",
    title: "Bedroom",
    columns: [
      {
        sections: [
          {
            heading: "Beds",
            links: [
              { title: "All Beds" },
              { title: "Solid Wood Beds" },
              { title: "Kids Beds" },
            ],
          },
          {
            heading: "Wardrobes",
            links: [
              { title: "All Wardrobe" },
              { title: "Sliding Door" },
            ],
          },
        ],
      },
      {
        sections: [
          {
            heading: "Mattresses & Pillows",
            links: [
              { title: "All Mattress" },
              { title: "Pillows" },
            ],
          }
        ]
      }
    ]
  },
  {
    key: "dining",
    title: "Dining",
    columns: [
      {
        sections: [
          {
            heading: "Dining Sets",
            links: [
              { title: "All Dining Table Sets" },
              { title: "6 Seater Dining Sets" },
            ],
          },
          {
            heading: "Dining Chairs",
            links: [
              { title: "All Dining Chairs" },
              { title: "Dining Benches" },
            ],
          },
        ],
      }
    ]
  },
  {
    key: "mattress",
    title: "Mattress",
    columns: [
      {
        sections: [
          {
            heading: "Mattress By Size",
            links: [
              { title: "King Size Mattress" }
            ]
          }
        ]
      }
    ]
  },
  {
    key: "storage",
    title: "Storage",
    columns: [
      {
        sections: [
          {
            heading: "TV Units",
            links: [
              { title: "All TV Units" }
            ]
          }
        ]
      }
    ]
  },
  {
    key: "study",
    title: "Study & Office",
    columns: [
      {
        sections: [
          {
            heading: "Tables",
            links: [
              { title: "Study Tables" },
              { title: "Office Tables" }
            ]
          }
        ]
      }
    ]
  },
  {
    key: "outdoor",
    title: "Outdoor",
    columns: [
      {
        sections: [
          {
            heading: "Balcony Furniture",
            links: [
              { title: "Balcony Sets" }
            ]
          }
        ]
      }
    ]
  },
  {
    key: "decor",
    title: "Decor & Furnishing",
    columns: [
      {
        sections: [
          {
            heading: "Wall Decor",
            links: [
              { title: "Wall Paintings" }
            ]
          }
        ]
      }
    ]
  },
  {
    key: "modular",
    title: "Modular Kitchen & Wardrobe",
  },
  {
    key: "NCluxe",
    title: "NC Luxe",
    columns: [
      {
        sections: [
          {
            heading: "Luxury Living",
            links: [
              { title: "Luxe Sofas" }
            ]
          }
        ]
      }
    ]
  }
];

function generateSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function run() {
  const flatCategories = [];
  const addedSlugs = new Set();

  function addCategory(title, parentId = null) {
    const slug = generateSlug(title);
    if (!addedSlugs.has(slug)) {
      addedSlugs.add(slug);
      flatCategories.push({
        _id: slug, // Using slug as the document ID for absolute simplicity
        title: title,
        slug: slug,
        parentId: parentId,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
  }

  // Parse the hierarchy
  for (const mainTab of wsCategories) {
    addCategory(mainTab.title, null);
    
    if (mainTab.columns) {
      for (const col of mainTab.columns) {
        for (const sec of col.sections) {
          if (sec.heading) {
            addCategory(sec.heading, generateSlug(mainTab.title));
            
            if (sec.links) {
              for (const link of sec.links) {
                addCategory(link.title, generateSlug(sec.heading));
              }
            }
          }
        }
      }
    }
  }

  console.log(`Generated ${flatCategories.length} categories to insert.`);

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("categories");

    await collection.deleteMany({});
    console.log("Cleared existing categories collection.");

    const result = await collection.insertMany(flatCategories);
    console.log(`Successfully added ${result.insertedCount} categories.`);
  } catch (err) {
    console.error("Error inserting categories:", err);
  } finally {
    await client.close();
  }
}

run();
