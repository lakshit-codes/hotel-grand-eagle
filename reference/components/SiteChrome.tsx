"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Search,
  ShoppingCart,
  Moon,
  Sun,
  Menu,
  X,
  ArrowUp,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Phone,
  Building2,
  Truck,
  HelpCircle,
  Store,
  User,
  Heart,
  Users,
  Wrench,
  ShieldCheck,
  ClipboardList,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Link, useLocation, useNavigate } from "@/lib/router";
import { useAppSelector } from "@/lib/store/hooks";
import { selectCartCount } from "@/lib/store/cart/cartSlice";
import { products } from "@/data/products";

// --- Types ---
type MegaMenuLink = { title: string; href: string };
type MegaMenuSection = { heading: string; links: MegaMenuLink[] };
type MegaMenuColumn = { sections: MegaMenuSection[] };

type ShopMegaTab = {
  key: string;
  title: string;
  isLuxe?: boolean;
  isModular?: boolean;
  columns?: MegaMenuColumn[];
  promo?: {
    img: string;
    href: string;
    title?: string;
    subtitle?: string;
    badge?: string;
  };
};

// --- Exact Categories Data based on provided Images ---
const wsCategories: ShopMegaTab[] = [
  {
    key: "sofas",
    title: "Sofas",
    columns: [
      {
        sections: [
          {
            heading: "Sofa",
            links: [
              { title: "All Sofas", href: "#" },
              { title: "Fabric Sofas", href: "#" },
              { title: "Wooden Sofas", href: "#" },
              { title: "3 Seater Sofas", href: "#" },
              { title: "2 Seater Sofas", href: "#" },
              { title: "1 Seater Sofas", href: "#" },
              { title: "3+1+1 Sofa Sets", href: "#" },
              { title: "Sofa Cum Beds", href: "#" },
              { title: "L Shaped Sofas", href: "#" },
              { title: "Chaise Loungers", href: "#" },
              { title: "Outdoor Sofas", href: "#" },
              { title: "Diwans", href: "#" },
            ],
          },
        ],
      },
      {
        sections: [
          {
            heading: "Sofa Cum Bed",
            links: [
              { title: "All Sofa Cum Beds", href: "#" },
              { title: "Wooden Sofa Cum Beds", href: "#" },
              { title: "Fabric Sofa Cum Beds", href: "#" },
            ],
          },
          {
            heading: "Recliners",
            links: [
              { title: "All Recliners", href: "#" },
              { title: "1 Seater Recliners", href: "#" },
              { title: "2 Seater Recliners", href: "#" },
              { title: "3 Seater Recliners", href: "#" },
            ],
          },
        ],
      },
      {
        sections: [
          {
            heading: "Seating",
            links: [
              { title: "Lounge Chairs", href: "#" },
              { title: "Accent Chairs", href: "#" },
              { title: "Arm Chair", href: "#" },
              { title: "Wingback Chairs", href: "#" },
              { title: "Bean Bags", href: "#" },
              { title: "Loveseats", href: "#" },
              { title: "Benches", href: "#" },
              { title: "Ottomans", href: "#" },
              { title: "Stools", href: "#" },
            ],
          },
        ],
      },
    ],
    promo: {
      img: "/assets/Image/Sofa.jpg",
      href: "#",
    },
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
              { title: "Fabric Sofas", href: "#" },
              { title: "Wooden Sofas", href: "#" },
              { title: "3 Seater Sofas", href: "#" },
              { title: "2 Seater Sofas", href: "#" },
              { title: "1 Seater Sofas", href: "#" },
              { title: "Sofa Sets", href: "#" },
              { title: "L Shaped Sofas", href: "#" },
              { title: "Chaise Loungers", href: "#" },
              { title: "Diwans", href: "#" },
            ],
          },
          {
            heading: "Sofa Cum Beds",
            links: [
              { title: "All Sofa Cum Beds", href: "#" },
              { title: "Wooden Sofa Cum Beds", href: "#" },
              { title: "Fabric Sofa Cum Beds", href: "#" },
            ],
          },
          {
            heading: "Recliners",
            links: [
              { title: "All Recliners", href: "#" },
              { title: "1 Seater Recliners", href: "#" },
              { title: "2 Seater Recliners", href: "#" },
              { title: "3 Seater Recliners", href: "#" },
            ],
          },
        ],
      },
      {
        sections: [
          {
            heading: "Chairs",
            links: [
              { title: "All Chairs", href: "#" },
              { title: "Lounge Chairs", href: "#" },
              { title: "Arm Chairs", href: "#" },
              { title: "Wing Chairs", href: "#" },
              { title: "Swing Chair", href: "#" },
              { title: "Rocking Chairs", href: "#" },
            ],
          },
          {
            heading: "Seating",
            links: [
              { title: "Stools", href: "#" },
              { title: "Benches", href: "#" },
              { title: "Loveseats", href: "#" },
              { title: "Bean Bags", href: "#" },
              { title: "Ottomans & Pouffes", href: "#" },
            ],
          },
          {
            heading: "Room Dividers",
            links: [],
          },
        ],
      },
      {
        sections: [
          {
            heading: "Tables",
            links: [
              { title: "All Tables", href: "#" },
              { title: "Coffee Tables", href: "#" },
              { title: "Coffee Table Sets", href: "#" },
              { title: "Side Tables", href: "#" },
              { title: "Nesting Tables", href: "#" },
              { title: "Console Table", href: "#" },
              { title: "Laptop Tables", href: "#" },
            ],
          },
          {
            heading: "TV Units",
            links: [
              { title: "All TV Units", href: "#" },
              { title: "Solid Wood TV Units", href: "#" },
              { title: "Engineered Wood TV Units", href: "#" },
            ],
          },
          {
            heading: "Home Temples",
            links: [],
          },
        ],
      },
      {
        sections: [
          {
            heading: "Living Storage",
            links: [
              { title: "Bookshelves", href: "#" },
              { title: "Chest of Drawers", href: "#" },
              { title: "Cabinet & Sideboards", href: "#" },
              { title: "Display Units", href: "#" },
              { title: "Wall Shelves", href: "#" },
              { title: "Home Temples", href: "#" },
              { title: "Shoe Racks", href: "#" },
            ],
          },
          {
            heading: "Furnishing",
            links: [
              { title: "Sofa Covers", href: "#" },
              { title: "Cushion Covers", href: "#" },
              { title: "Cushion Fillers", href: "#" },
              { title: "Rugs And Carpets", href: "#" },
              { title: "Table Runners", href: "#" },
              { title: "Floor Runners", href: "#" },
            ],
          },
        ],
      },
    ],
    promo: {
      img: "/assets/Image/living.jpg",
      href: "#",
    },
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
              { title: "All Beds", href: "#" },
              { title: "Solid Wood Beds", href: "#" },
              { title: "Engineered Wood Beds", href: "#" },
              { title: "Upholstered Beds", href: "#" },
              { title: "Hydraulic Storage Beds", href: "#" },
              { title: "Poster Beds", href: "#" },
              { title: "Kids Beds", href: "#" },
            ],
          },
          {
            heading: "Bed With Mattress",
            links: [],
          },
        ],
      },
      {
        sections: [
          {
            heading: "By Size",
            links: [
              { title: "King Size Beds", href: "#" },
              { title: "Queen Size Beds", href: "#" },
              { title: "Double Beds", href: "#" },
              { title: "Single Beds", href: "#" },
            ],
          },
          {
            heading: "Sofa Cum Beds",
            links: [
              { title: "Wooden Sofa Cum Beds", href: "#" },
              { title: "Fabric Sofa Cum Beds", href: "#" },
              { title: "L Shaped Sofa Cum Beds", href: "#" },
            ],
          },
        ],
      },
      {
        sections: [
          {
            heading: "Wardrobes",
            links: [
              { title: "All Wardrobe", href: "#" },
              { title: "Solid Wood Wardrobes", href: "#" },
              { title: "Engineered Wood Wardrobes", href: "#" },
              { title: "1 Door Wardrobes", href: "#" },
              { title: "2 Door Wardrobes", href: "#" },
              { title: "3 Door Wardrobes", href: "#" },
              { title: "4+ Door Wardrobes", href: "#" },
              { title: "Sliding Door", href: "#" },
            ],
          },
        ],
      },
      {
        sections: [
          {
            heading: "Bedroom Tables",
            links: [
              { title: "Bedside Tables", href: "#" },
              { title: "Dressing Tables", href: "#" },
              { title: "Breakfast Tables", href: "#" },
              { title: "Trunk & Blanket Box", href: "#" },
            ],
          },
        ],
      },
      {
        sections: [
          {
            heading: "Mattresses & Pillows",
            links: [
              { title: "All Mattress", href: "#" },
              { title: "King Size Mattress", href: "#" },
              { title: "Queen Size Mattress", href: "#" },
              { title: "Double Bed Mattress", href: "#" },
              { title: "Single Bed Mattress", href: "#" },
              { title: "Mattress Protectors", href: "#" },
              { title: "Mattress Toppers", href: "#" },
              { title: "Pillows", href: "#" },
            ],
          },
          {
            heading: "Bedding Essentials",
            links: [{ title: "Bedsheets", href: "#" }],
          },
        ],
      },
      {
        sections: [
          {
            heading: "Bundles & Combos",
            links: [
              { title: "King Size Bed + Mattress", href: "#" },
              { title: "Queen Size Bed + Mattress", href: "#" },
              { title: "Single Size Bed + Mattress", href: "#" },
            ],
          },
        ],
      },
    ],
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
              { title: "All Mattresses", href: "#" },
              { title: "King Size Mattress", href: "#" },
              { title: "Queen Size Mattress", href: "#" },
              { title: "Single Bed Mattress", href: "#" },
              { title: "Double Bed Mattress", href: "#" },
              { title: "Baby Mattress", href: "#" },
            ],
          },
          {
            heading: "Penguin Sleep Series",
            links: [
              { title: "Ortho Zen Mattress", href: "#" },
              { title: "Dream Lux Mattress", href: "#" },
              { title: "Bamboo Bliss Mattress", href: "#" },
            ],
          },
        ],
      },
      {
        sections: [
          {
            heading: "Mattress By Material",
            links: [
              { title: "Memory Foam Mattress", href: "#" },
              { title: "Foam Mattress", href: "#" },
              { title: "Latex Mattress", href: "#" },
              { title: "Cool Gel Mattress", href: "#" },
            ],
          },
          {
            heading: "Mattress By Need",
            links: [
              { title: "Orthopedic Support", href: "#" },
              { title: "Natural Living", href: "#" },
              { title: "Hybrid Comfort", href: "#" },
              { title: "Compact Living", href: "#" },
            ],
          },
        ],
      },
      {
        sections: [
          {
            heading: "Pillow By Material",
            links: [
              { title: "All Pillows", href: "#" },
              { title: "Memory Foam Pillow", href: "#" },
              { title: "Latex Pillow", href: "#" },
              { title: "Fiber Pillow", href: "#" },
            ],
          },
          {
            heading: "Pillow By Need",
            links: [
              { title: "Cervical Pillow", href: "#" },
              { title: "Travel Pillow", href: "#" },
              { title: "Wedge Pillow", href: "#" },
              { title: "Cuddle Pillow", href: "#" },
              { title: "Body Pillow", href: "#" },
            ],
          },
        ],
      },
      {
        sections: [
          {
            heading: "Mattress Accessories",
            links: [
              { title: "Mattress Toppers", href: "#" },
              { title: "Mattress Protectors", href: "#" },
            ],
          },
          {
            heading: "Bundles & Sets",
            links: [{ title: "Mattress & Bed Set", href: "#" }],
          },
        ],
      },
    ],
    promo: {
      img: "/assets/Image/matterss.jpeg",
      href: "#",
    },
  },
  {
    key: "dining",
    title: "Dining",
    columns: [
      {
        sections: [
          {
            heading: "Dining Room Furniture",
            links: [],
          },
          {
            heading: "Dining Sets",
            links: [
              { title: "All Dining Table Sets", href: "#" },
              { title: "6 Seater Dining Sets", href: "#" },
              { title: "4 Seater Dining Sets", href: "#" },
              { title: "2 Seater Dining Sets", href: "#" },
              { title: "8 Seater Dining Sets", href: "#" },
              { title: "Folding/Extendable Dining Sets", href: "#" },
            ],
          },
          {
            heading: "By Material",
            links: [
              { title: "Wooden Dining Sets", href: "#" },
              { title: "Marble Dining Sets", href: "#" },
              { title: "Metal Dining Sets", href: "#" },
            ],
          },
        ],
      },
      {
        sections: [
          {
            heading: "Dining Chairs",
            links: [
              { title: "All Dining Chairs", href: "#" },
              { title: "Wooden Dining Chairs", href: "#" },
              { title: "Fabric Dining Chairs", href: "#" },
              { title: "Dining Benches", href: "#" },
            ],
          },
          {
            heading: "Dining Tables",
            links: [],
          },
          {
            heading: "Covers",
            links: [
              { title: "Chair Covers", href: "#" },
              { title: "Chair Pads", href: "#" },
              { title: "Table Mats", href: "#" },
              { title: "Table Runners", href: "#" },
            ],
          },
        ],
      },
      {
        sections: [
          {
            heading: "Kitchen Storage & Organisers",
            links: [
              { title: "All Kitchen Storage", href: "#" },
              { title: "Cabinets & Sideboards", href: "#" },
              { title: "Chest of Drawers", href: "#" },
              { title: "Kitchen Cabinets", href: "#" },
              { title: "Kitchen Racks", href: "#" },
              { title: "Microwave Stands", href: "#" },
              { title: "Kitchen Trolleys", href: "#" },
            ],
          },
          {
            heading: "Serveware",
            links: [
              { title: "Serving Trays", href: "#" },
              { title: "Cake Stands", href: "#" },
              { title: "Platters", href: "#" },
              { title: "Cutlery Holders", href: "#" },
              { title: "Tissue Box", href: "#" },
            ],
          },
        ],
      },
      {
        sections: [
          {
            heading: "Bar Furniture",
            links: [
              { title: "Bar Cabinets", href: "#" },
              { title: "Wine Trolleys", href: "#" },
              { title: "Bar Table Sets", href: "#" },
            ],
          },
          {
            heading: "Kitchen Essentials",
            links: [
              { title: "Chopping Boards", href: "#" },
              { title: "Spice Box", href: "#" },
              { title: "Casseroles", href: "#" },
            ],
          },
        ],
      },
    ],
    promo: {
      img: "/assets/Image/dining.jpeg",
      href: "#",
    },
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
              { title: "All TV Units", href: "#" },
              { title: "Solid Wood TV Units", href: "#" },
              { title: "Engineered Wood TV Units", href: "#" },
            ],
          },
          {
            heading: "Shoe Racks",
            links: [
              { title: "Solid Wood Shoe Racks", href: "#" },
              { title: "Modular Shoe Racks", href: "#" },
            ],
          },
          {
            heading: "Living Storage",
            links: [
              { title: "Bookshelves", href: "#" },
              { title: "Chest of Drawers", href: "#" },
              { title: "Cabinet & Sideboards", href: "#" },
              { title: "Display Units", href: "#" },
              { title: "Wall Shelves", href: "#" },
              { title: "Home Temples", href: "#" },
            ],
          },
        ],
      },
      {
        sections: [
          {
            heading: "Wardrobes",
            links: [
              { title: "All Wardrobe", href: "#" },
              { title: "Solid Wood Wardrobes", href: "#" },
              { title: "Engineered Wood Wardrobes", href: "#" },
              { title: "1 Door Wardrobes", href: "#" },
              { title: "2 Door Wardrobes", href: "#" },
              { title: "3 Door Wardrobes", href: "#" },
              { title: "4+ Door Wardrobes", href: "#" },
              { title: "Sliding Door", href: "#" },
            ],
          },
          {
            heading: "Bedroom Storage",
            links: [
              { title: "Dressing Table", href: "#" },
              { title: "Chest of Drawers", href: "#" },
              { title: "Bedside Tables", href: "#" },
              { title: "Showcase", href: "#" },
              { title: "Trunk & Blanket Box", href: "#" },
            ],
          },
        ],
      },
      {
        sections: [
          {
            heading: "Kitchen Storage",
            links: [
              { title: "Kitchen Cabinets", href: "#" },
              { title: "Kitchen Trolley", href: "#" },
              { title: "Crockery Unit", href: "#" },
              { title: "Kitchen Racks", href: "#" },
              { title: "Microwave Stand", href: "#" },
              { title: "Hutch Cabinets", href: "#" },
            ],
          },
          {
            heading: "Bar Furniture",
            links: [
              { title: "Bar Cabinets", href: "#" },
              { title: "Bar Trolleys", href: "#" },
            ],
          },
        ],
      },
    ],
    promo: {
      img: "/assets/Image/storage.jpg",
      href: "#",
    },
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
              { title: "Study Tables", href: "#" },
              { title: "Computer Tables", href: "#" },
              { title: "Laptop Tables", href: "#" },
              { title: "Folding Study Tables", href: "#" },
              { title: "Corner Study Table", href: "#" },
              { title: "Wall Mounted Study Table", href: "#" },
              { title: "Height Adjustable Table", href: "#" },
              { title: "Office Tables", href: "#" },
            ],
          },
        ],
      },
      {
        sections: [
          {
            heading: "Seating & Chairs",
            links: [
              { title: "Office Chairs", href: "#" },
              { title: "Study Chairs", href: "#" },
              { title: "Gaming Chairs", href: "#" },
              { title: "Executive & Director Chairs", href: "#" },
              { title: "Cafeteria & Visitor Chairs", href: "#" },
              { title: "Office Sofas", href: "#" },
            ],
          },
        ],
      },
      {
        sections: [
          {
            heading: "Storage",
            links: [
              { title: "File Cabinets", href: "#" },
              { title: "Office Bookcases", href: "#" },
              { title: "Wall Shelves", href: "#" },
            ],
          },
        ],
      },
    ],
    promo: {
      img: "/assets/Image/study.jpeg",
      href: "#",
    },
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
              { title: "Balcony Sets", href: "#" },
              { title: "Balcony Chairs", href: "#" },
              { title: "Balcony Tables", href: "#" },
              { title: "Swings", href: "#" },
            ],
          },
        ],
      },
      {
        sections: [
          {
            heading: "Outdoor Furniture",
            links: [
              { title: "All Outdoor Sets", href: "#" },
              { title: "Table & Chair Sets", href: "#" },
              { title: "Sofa Sets", href: "#" },
              { title: "Loungers", href: "#" },
            ],
          },
        ],
      },
      {
        sections: [
          {
            heading: "Home Garden",
            links: [
              { title: "Artificial Flowers", href: "#" },
              { title: "Artificial Plants", href: "#" },
              { title: "Fountain", href: "#" },
            ],
          },
        ],
      },
    ],
    promo: {
      img: "/assets/Image/outdoor.jpg",
      href: "#",
    },
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
              { title: "Wall Shelves", href: "#" },
              { title: "Key Holders", href: "#" },
              { title: "Wall Mirror", href: "#" },
              { title: "Wall Paintings", href: "#" },
              { title: "Wall Arts", href: "#" },
              { title: "Wall Plates", href: "#" },
              { title: "Jharokhas", href: "#" },
            ],
          },
          {
            heading: "Clocks",
            links: [
              { title: "Wall Clocks", href: "#" },
              { title: "Table Clocks", href: "#" },
            ],
          },
          {
            heading: "Bathroom Accessories",
            links: [{ title: "Soap Dispenser Sets", href: "#" }],
          },
          {
            heading: "Home Improvement",
            links: [],
          },
          {
            heading: "Room Dividers",
            links: [],
          },
        ],
      },
      {
        sections: [
          {
            heading: "Spiritual",
            links: [{ title: "Home Temples", href: "#" }],
          },
          {
            heading: "Mirrors",
            links: [
              { title: "All Mirrors", href: "#" },
              { title: "Wall Mirror", href: "#" },
              { title: "Bathroom Mirrors", href: "#" },
              { title: "Full Length Mirrors", href: "#" },
            ],
          },
          {
            heading: "Table Decor",
            links: [
              { title: "Vases", href: "#" },
              { title: "Artificial Flowers", href: "#" },
              { title: "Showpieces & Figurines", href: "#" },
              { title: "Candle Holders", href: "#" },
              { title: "Desk Organisers", href: "#" },
            ],
          },
        ],
      },
      {
        sections: [
          {
            heading: "Lamps",
            links: [
              { title: "All Lamps", href: "#" },
              { title: "Floor Lamps", href: "#" },
              { title: "Table Lamps", href: "#" },
              { title: "Study Lamps", href: "#" },
            ],
          },
          {
            heading: "Chandeliers",
            links: [
              { title: "All Lamps", href: "#" },
              { title: "All Chandeliers", href: "#" },
              { title: "Chandelier Fans", href: "#" },
            ],
          },
          {
            heading: "Lights",
            links: [{ title: "Hanging Lights", href: "#" }],
          },
          {
            heading: "Lamp Shades",
            links: [],
          },
        ],
      },
      {
        sections: [
          {
            heading: "Furnishing",
            links: [
              { title: "Sofa Covers", href: "#" },
              { title: "Chair Covers", href: "#" },
              { title: "Cushion Covers", href: "#" },
              { title: "Bed Sheets", href: "#" },
              { title: "Table Linen", href: "#" },
              { title: "Rugs & Carpets", href: "#" },
              { title: "Fabrics", href: "#" },
            ],
          },
        ],
      },
    ],
    promo: {
      img: "/assets/Image/decor.jpg",
      href: "#",
    },
  },
  // --- New: Modular Kitchen & Wardrobe ---
  {
    key: "modular",
    title: "Modular Kitchen & Wardrobe",
    isModular: true,
  },
  // --- New: WS Luxe ---
  {
    key: "NCluxe",
    title: "NC Luxe",
    isLuxe: true,
    columns: [
      {
        sections: [
          {
            heading: "Luxury Living",
            links: [
              { title: "Luxe Sofas", href: "#" },
              { title: "Luxe Lounge Chairs", href: "#" },
              { title: "Premium Coffee Tables", href: "#" },
              { title: "Luxe TV Units", href: "#" },
            ],
          },
          {
            heading: "Luxury Dining",
            links: [
              { title: "Premium Dining Sets", href: "#" },
              { title: "Marble Dining Tables", href: "#" },
              { title: "Luxe Dining Chairs", href: "#" },
            ],
          },
        ],
      },
      {
        sections: [
          {
            heading: "Luxury Bedroom",
            links: [
              { title: "Luxe Beds", href: "#" },
              { title: "Upholstered Premium Beds", href: "#" },
              { title: "Luxe Wardrobes", href: "#" },
              { title: "Premium Bedside Tables", href: "#" },
            ],
          },
          {
            heading: "Luxury Decor",
            links: [
              { title: "Premium Wall Art", href: "#" },
              { title: "Luxe Chandeliers", href: "#" },
              { title: "Designer Rugs", href: "#" },
            ],
          },
        ],
      },
    ],
    promo: {
      img: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=400",
      href: "#",
    },
  },
];

// --- 3-Tier Header Component ---
const Header = ({
  theme,
  toggleTheme,
  onSearchOpen,
}: {
  theme: string;
  toggleTheme: () => void;
  onSearchOpen: () => void;
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMegaTab, setActiveMegaTab] = useState<string | null>(null);
  const cartCount = useAppSelector(selectCartCount);
  const { pathname } = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  const activeTab = wsCategories.find((tab) => tab.key === activeMegaTab);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveMegaTab(null);
  }, [pathname]);

  // Handle Scroll for Sticky logic
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 120) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className="w-full bg-background flex flex-col z-[1100] relative">
        {/* TIER 1: Top Bar */}
        <div className="hidden lg:flex items-center justify-between px-4 sm:px-[5%] xl:px-[8%] py-2 bg-surface/40 border-b border-border text-[12px] text-muted">
          <div className="flex items-center gap-6 font-medium">
            <Link
              href="/furniture"
              className="hover:text-secondary transition-colors text-secondary"
            >
              Furniture
            </Link>
            <Link
              href="/home-interiors"
              className="hover:text-secondary transition-colors"
            >
              Home Interiors
            </Link>
            <Link
              href="/bulk-order"
              className="hover:text-secondary transition-colors"
            >
              Bulk Order
            </Link>
          </div>

          {/* UPDATED: Top Bar Spacing (Tighter gaps as requested) */}
          <div className="flex items-center gap-3 sm:gap-4 font-medium">
            <a
              href="tel:+91 9810159604"
              className="flex items-center gap-1.5 hover:text-secondary transition-colors"
            >
              <Phone size={13} /> +91-9810159604
            </a>
            <div className="w-px h-3.5 bg-border/80"></div>
            <Link
              href="/franchise"
              className="flex items-center gap-1.5 hover:text-secondary transition-colors"
            >
              <Building2 size={13} /> Become a Franchise
            </Link>
            <div className="w-px h-3.5 bg-border/80"></div>
            <Link
              href="/track-order"
              className="flex items-center gap-1.5 hover:text-secondary transition-colors"
            >
              <Truck size={13} /> Track Order
            </Link>
            <div className="w-px h-3.5 bg-border/80"></div>
            <Link
              href="/help"
              className="flex items-center gap-1.5 hover:text-secondary transition-colors"
            >
              <HelpCircle size={13} /> Help Center
            </Link>
            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-2 py-1 rounded-md 
             bg-secondary/10 text-secondary font-medium
             hover:bg-secondary/20 transition-all"
            >
              <User size={14} /> Admin
            </Link>
          </div>
        </div>

        {/* TIER 2: Middle Bar (Logo, Search, Icons) */}
        <div className="flex items-center justify-between px-4 sm:px-[5%] xl:px-[8%] py-4 bg-background">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 -ml-2 text-foreground"
          >
            <Menu size={24} />
          </button>

          <div className="shrink-0 flex-1 lg:flex-none flex justify-center lg:justify-start">
            <Link href="/" className="block py-1">
              {/* UPDATED: Increased Logo Size */}
              <img
                src="/assets/Image/nestcraft-logo.svg"
                alt="NestCraft"
                className="h-14 sm:h-18 w-auto object-contain"
              />
            </Link>
          </div>

          <div
            className="hidden lg:flex flex-1 max-w-2xl mx-12 relative group cursor-text"
            onClick={onSearchOpen}
          >
            <div className="w-full flex items-center h-12 rounded-sm border border-border bg-surface px-4 text-muted group-hover:border-secondary transition-colors">
              <span className="text-[14px]">
                Search Products, Color & More...
              </span>
              <Search size={20} className="absolute right-4 text-muted" />
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-8 shrink-0">
            <button
              onClick={toggleTheme}
              className="hidden sm:flex flex-col items-center gap-1 text-muted hover:text-secondary transition-colors"
            >
              {theme === "dark" ? <Sun size={22} /> : <Moon size={22} />}
              <span className="text-[11px] font-medium hidden lg:block">
                Theme
              </span>
            </button>
            <Link
              href="/stores"
              className="hidden lg:flex flex-col items-center gap-1 text-muted hover:text-secondary transition-colors"
            >
              <Store size={22} />
              <span className="text-[11px] font-medium">Stores</span>
            </Link>
            <Link
              href="/profile"
              className="hidden sm:flex flex-col items-center gap-1 text-muted hover:text-secondary transition-colors"
            >
              <User size={22} />
              <span className="text-[11px] font-medium">Profile</span>
            </Link>
            <Link
              href="/wishlist"
              className="hidden sm:flex flex-col items-center gap-1 text-muted hover:text-secondary transition-colors"
            >
              <Heart size={22} />
              <span className="text-[11px] font-medium">Wishlist (0)</span>
            </Link>
            <Link
              href="/cart"
              className="flex flex-col items-center gap-1 text-muted hover:text-secondary transition-colors relative"
            >
              <div className="relative">
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-2 flex h-[16px] w-[16px] items-center justify-center rounded-full bg-secondary text-[9px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-medium hidden lg:block">
                Cart ({cartCount})
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* TIER 3: Category Bar - STICKY logic applied here */}
      <div
        className={`hidden lg:block w-full bg-background border-y border-border shadow-sm z-[1150] transition-all duration-300 ${
          isScrolled ? "fixed top-0 left-0" : "relative"
        }`}
      >
        <div
          className="mx-auto px-4 sm:px-[5%] xl:px-[8%] flex items-center justify-between"
          onMouseLeave={() => setActiveMegaTab(null)}
        >
          {wsCategories.map((tab) => {
            const isActive = activeMegaTab === tab.key;
            return (
              <button
                key={tab.key}
                onMouseEnter={() => setActiveMegaTab(tab.key)}
                className={`group relative py-4 text-[14px] font-medium transition-colors ${
                  tab.isLuxe
                    ? "text-black"
                    : isActive
                      ? "text-secondary"
                      : "text-foreground hover:text-secondary"
                }`}
              >
                <span>{tab.title}</span>
                <span
                  className={`absolute bottom-0 left-0 h-[3px] bg-secondary transition-all duration-200 ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
                />
              </button>
            );
          })}

          {/* Mega Menu Dropdown */}
          <AnimatePresence>
            {activeMegaTab && activeTab && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 top-[100%] w-full bg-background border-b border-border shadow-2xl"
                onMouseEnter={() => setActiveMegaTab(activeTab.key)}
              >
                <div className="mx-auto px-4 sm:px-[5%] xl:px-[8%] py-8">
                  {/* UPDATED: Handle Modular Kitchen Special Layout */}
                  {activeTab.isModular ? (
                    <div className="flex flex-col lg:flex-row gap-8 xl:gap-16 justify-between">
                      {/* Left Info Panel */}
                      <div className="flex-1 max-w-md pt-2">
                        <h3 className="text-2xl sm:text-3xl text-foreground font-light mb-12 leading-snug">
                          Transform your home's style with our innovative{" "}
                          <span className="font-bold">Design</span>
                        </h3>

                        <div className="grid grid-cols-4 gap-4 text-center">
                          <div className="flex flex-col items-center">
                            <div className="h-12 w-12 rounded-full flex items-center justify-center text-secondary mb-3">
                              <Users strokeWidth={1.5} size={32} />
                            </div>
                            <span className="text-[11px] font-medium text-muted px-2">
                              20,000+ happy customers
                            </span>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="h-12 w-12 rounded-full flex items-center justify-center text-secondary mb-3">
                              <Wrench strokeWidth={1.5} size={32} />
                            </div>
                            <span className="text-[11px] font-medium text-muted px-2">
                              Branded Hardware and Materials
                            </span>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="h-12 w-12 rounded-full flex items-center justify-center text-secondary mb-3">
                              <ShieldCheck strokeWidth={1.5} size={32} />
                            </div>
                            <span className="text-[11px] font-medium text-muted px-2">
                              Up to 10-years* material warranty
                            </span>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="h-12 w-12 rounded-full flex items-center justify-center text-secondary mb-3">
                              <ClipboardList strokeWidth={1.5} size={32} />
                            </div>
                            <span className="text-[11px] font-medium text-muted px-2">
                              Stringent Quality Checks
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Promo Images */}
                      <div className="flex gap-6 flex-1">
                        <Link
                          href="/modular-kitchen"
                          className="group block flex-1"
                        >
                          <div className="rounded-lg overflow-hidden bg-surface mb-3 h-[240px]">
                            <img
                              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800"
                              alt="Modular Kitchen"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                          <h4 className="text-center font-medium text-foreground text-lg">
                            Modular Kitchen
                          </h4>
                          <p className="text-center text-muted text-sm mt-1">
                            Starting From ₹1,49,999
                          </p>
                        </Link>
                        <Link
                          href="/modular-wardrobe"
                          className="group block flex-1"
                        >
                          <div className="rounded-lg overflow-hidden bg-surface mb-3 h-[240px]">
                            <img
                              src="https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&q=80&w=800"
                              alt="Modular Wardrobe"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                          <h4 className="text-center font-medium text-foreground text-lg">
                            Modular Wardrobe
                          </h4>
                          <p className="text-center text-muted text-sm mt-1">
                            Starting From ₹49,999
                          </p>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    // Standard Mega Menu Columns
                    <div className="flex gap-8 justify-between">
                      <div className="flex gap-12 flex-1 flex-wrap">
                        {activeTab.columns?.map((col, colIndex) => (
                          <div
                            key={colIndex}
                            className="flex flex-col gap-8 min-w-[160px]"
                          >
                            {col.sections.map((section, secIndex) => (
                              <div key={secIndex}>
                                <h4 className="mb-3 text-[14px] font-bold text-foreground">
                                  {section.heading}
                                </h4>
                                {/* UPDATED: Margin reduced to 3px spacing between links */}
                                <ul className="space-y-[3px]">
                                  {section.links.map((link) => (
                                    <li key={link.title}>
                                      <Link
                                        href={link.href}
                                        className="text-[13px] text-muted transition-colors hover:text-secondary"
                                      >
                                        {link.title}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>

                      {activeTab.promo && (
                        <div className="w-[300px] shrink-0 border-l border-border pl-8 hidden xl:block">
                          <Link
                            href={activeTab.promo.href}
                            className="block overflow-hidden rounded-md bg-surface group relative h-[350px]"
                          >
                            <img
                              src={activeTab.promo.img}
                              alt="Category Promo"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Placeholder to prevent layout jump when category bar becomes sticky */}
      {isScrolled && <div className="hidden lg:block h-[53px] w-full" />}

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[2000] bg-black/50 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed left-0 top-0 z-[2001] h-full w-[min(85vw,350px)] overflow-y-auto bg-background px-5 py-6 shadow-2xl lg:hidden"
            >
              <div className="mb-6 flex items-center justify-between">
                <img
                  src="/assets/Image/nestcraft-logo.svg"
                  alt="NestCraft"
                  className="h-10 w-auto"
                />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-muted"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-4">
                {wsCategories.map((tab) => (
                  <div key={tab.key} className="border-b border-border pb-3">
                    <Link
                      href={`/category/${tab.key}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block text-lg font-semibold ${tab.isLuxe ? "text-black" : "text-foreground"}`}
                    >
                      {tab.title}
                    </Link>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

// --- Search Overlay & Footer & SiteChrome (unchanged mostly) ---
const SearchOverlay = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  const filteredProducts =
    query.length > 1
      ? products.filter(
          (p) =>
            p.title.toLowerCase().includes(query.toLowerCase()) ||
            p.category.toLowerCase().includes(query.toLowerCase()),
        )
      : [];

  const handleSelect = (id: number) => {
    navigate(`/product/${id}`);
    onClose();
    setQuery("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[3000] flex flex-col items-center bg-background/95 px-4 pt-24 backdrop-blur-xl sm:px-[5%] sm:pt-32"
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-border transition-all hover:bg-surface sm:right-10 sm:top-10"
          >
            <X size={22} />
          </button>
          <div className="w-full max-w-3xl">
            <div className="relative mb-10 sm:mb-12">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted sm:left-6"
                size={22}
              />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for furniture..."
                className="h-16 w-full rounded-[24px] border border-border bg-surface pl-12 pr-4 text-lg font-bold outline-none transition-all placeholder:text-muted/30 focus:border-secondary sm:h-20 sm:pl-16 sm:pr-8 sm:text-2xl"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Footer = () => (
  <footer
    data-annotate-id="site-footer"
    className="border-t border-border bg-surface px-[5%] pb-10 pt-20"
  >
    <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
      <div className="space-y-6">
        <Link href="/" className="block">
          <img
            src="/assets/Image/nestcraft-logo.svg"
            alt="NestCraft"
            className="h-26 w-auto"
          />
        </Link>

        <p className="max-w-[300px] font-semibold text-muted">
          Sculpting personal spaces with design-led essentials. Minimalist
          furniture crafted for the modern home.
        </p>

        <div className="flex gap-4">
          {[
            {
              name: "Instagram",
              icon: Instagram,
              url: "https://www.instagram.com/nestcraft_furniture/",
            },
            {
              name: "Facebook",
              icon: Facebook,
              url: "https://www.facebook.com/profile.php?id=61581337593979",
            },
            {
              name: "Twitter",
              icon: Twitter,
              url: "https://x.com/NestCFurniture",
            },
            { name: "Youtube", icon: Youtube, url: "#" },
          ].map((social) => (
            <a
              key={social.name}
              href={social.url}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-all hover:border-secondary hover:text-secondary"
            >
              <span className="sr-only">{social.name}</span>
              <social.icon size={18} />
            </a>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-6 text-[11px] font-black uppercase tracking-[2px] text-foreground">
          Shop
        </h4>
        <ul className="space-y-4">
          {[
            "Living Room",
            "Bedroom",
            "Dining Room",
            "Home Office",
            "Decor",
          ].map((item) => (
            <li key={item}>
              <Link
                href="/shop"
                className="font-bold text-muted transition-colors hover:text-secondary"
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="mb-6 text-[11px] font-black uppercase tracking-[2px] text-foreground">
          Company
        </h4>
        <ul className="space-y-4">
          {[
            { name: "Our Story", path: "/about" },
            { name: "Craftsmanship", path: "/about" },
            { name: "Sustainability", path: "/about" },
            { name: "Contact", path: "/contact" },
          ].map((item) => (
            <li key={item.name}>
              <Link
                href={item.path}
                className="font-bold text-muted transition-colors hover:text-secondary"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="mb-6 text-[11px] font-black uppercase tracking-[2px] text-foreground">
          Support
        </h4>
        <ul className="space-y-4">
          {[
            { name: "Shipping & Delivery", path: "/faq" },
            { name: "Returns & Exchanges", path: "/faq" },
            { name: "Care Guide", path: "/faq" },
            { name: "FAQ", path: "/faq" },
            { name: "Privacy Policy", path: "/faq" },
          ].map((item) => (
            <li key={item.name}>
              <Link
                href={item.path}
                className="font-bold text-muted transition-colors hover:text-secondary"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>

    <div className="huge-watermark">NESTCRAFT</div>

    <div className="md:flex text-center flex-col items-center justify-between gap-6 border-t border-border mt-10 pt-2 md:flex-row">
      <p className="py-2 text-[14px] font-medium transition-colors text-[#0b1610]">
        © 2026 NestCraft Interiors. All rights reserved.
      </p>
      <div className="flex items-center justify-center gap-8">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="group relative text-center inline-flex items-center  text-[14px] font-medium transition-colors text-[#0b1610] hover:text-[#98c45f]"
        >
          Back to Top <ArrowUp size={14} className="ml-1" />
        </button>
        <div className="hidden gap-8 md:flex">
          <a
            href="#"
            className="text-[14px] font-medium transition-colors text-[#0b1610] hover:text-[#98c45f]"
          >
            Terms
          </a>
          <a
            href="#"
            className="text-[14px] font-medium transition-colors text-[#0b1610] hover:text-[#98c45f]"
          >
            Privacy
          </a>
          <a
            href="#"
            className="text-[14px] font-medium transition-colors text-[#0b1610] hover:text-[#98c45f]"
          >
            Cookies
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default function SiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState("light");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      const initialTheme = prefersDark ? "dark" : "light";
      setTheme(initialTheme);
      document.documentElement.setAttribute("data-theme", initialTheme);
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsSearchOpen(false);
  }, [pathname]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        onSearchOpen={() => setIsSearchOpen(true)}
      />
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
    </div>
  );
}
