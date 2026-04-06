# Product Import Integration Guide

This document provides technical details for integrating the Product Bulk Import feature into external admin panels or third-party systems.

## API Endpoint

**URL**: `/api/ecommerce/products/bulk`  
**Method**: `POST`  
**Content-Type**: `application/json`

### Authentication
The API requires valid tenant access. Ensure the request is made within a session that has appropriate `requireTenantAccess` permissions.

## JSON Data Structure

The API expects an array of product objects.

### Sample JSON
```json
[
  {
    "name": "Sony WH-1000XM5 Headphones",
    "sku": "SONY-XM5-001",
    "type": "physical",
    "price": 349.99,
    "compareAtPrice": 399.99,
    "description": "Premium noise-canceling headphones.",
    "status": "active",
    "categoryIds": ["electronics", "audio", "headphones"],
    "images": [
      "https://images.unsplash.com/photo-1618366712277-722026af94bf?auto=format&fit=crop&q=80&w=800"
    ],
    "options": [
      { "label": "Color", "values": ["Black", "Silver"] }
    ],
    "variants": [
      {
        "sku": "SONY-XM5-BLK",
        "title": "Black Color",
        "price": 349.99,
        "stock": 45,
        "optionValues": { "Color": "Black" }
      }
    ]
  }
]
```

### Field Definitions
- `name` (Required): Display name of the product.
- `sku` (Required): Unique Stock Keeping Unit.
- `price` (Optional): Base price of the product.
- `categoryIds`: Array of category **slugs**.
- `categories`: Array of category **names** (will be resolved to slugs automatically).
- `images`: Array of image URLs (strings).
- `options`: Array of attribute definitions for variants. Labels must exist in the system's `attribute_sets`.
- `variants`: Array of variant objects with their own `sku`, `price`, and `optionValues` map.

## Validation Rules

The API performs a strict **Pre-import Validation** step. If any of the following checks fail, the entire import is rejected with a `400 Bad Request` status:

1. **Category Check**: All `categoryIds` (slugs) and `categories` (names) provided must exist in the database.
2. **Attribute Check**: All `options[].label` must match an existing attribute label in the tenant's `attribute_sets` (where `appliesTo: "product"`).
3. **SKU Uniqueness**: While the API handles slug generation automatically, unique SKUs are enforced at the database level during creation.

## Error Response Format
If validation fails, you will receive a response like this:
```json
{
  "error": "Pre-import validation failed",
  "details": {
    "missingCategoryIds": ["not-a-slug"],
    "missingCategoryNames": [],
    "missingOptions": ["NonExistentAttribute"]
  },
  "message": "Some categories or product options are not defined in the system..."
}
```
