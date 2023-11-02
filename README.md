# Medusa Custom Attributes Plugin

The Medusa Custom Attributes Plugin is designed to enhance your e-commerce platform with custom attributes, providing compatibility with versions >= 1.8.0 of `@medusajs/medusa`.

## Features

1. **Diverse Attribute Types**: The plugin supports multi, single, and boolean attributes, enabling a wide range of attribute customizations. 🤯
2. **Effortless Ranking**: Easily rank attribute values via a drag-and-drop interface in the admin panel. 🤌🏻
3. **Efficient Product Filtering**: Filter your products with ease by using these custom attributes. 💪
4. **Category-Based Attributes**: You can get attributes specific to particular categories, ensuring attribute relevance. 👀

## Getting Started

### Installation

To get started, install the Medusa Custom Attributes Plugin with either npm or yarn:

```bash
npm install medusa-custom-attributes
```

or

```
yarn add medusa-custom-attributes
```

(Optional) Next toggle categories feature flag to your .env:

```
MEDUSA_FF_PRODUCT_CATEGORIES=true
```

### Configuration

Next, add the plugin to your medusa-config.js file as follows:

```
const plugins = [
  // ...
  {
    resolve: `medusa-custom-attributes`,
    options: {
      enableUI: true,
    },
  },
]
```

Now you're all set and ready to launch! 🚀

### Why Use the Medusa Custom Attributes Plugin?

The Medusa Custom Attributes Plugin empowers you to define custom attributes within categories and apply them to your products. With this plugin, you can filter your products based on these custom attributes, offering a more tailored shopping experience for your customers.

### Using on storefront

After adding custom attributes to product, you can see field `attribute_values` in product responses. Also, you can filter them using query parameters in the URL. For example:

```
/store/products?attributes_id[0]=[CUSTOM_ATTRIBUTE_VAL_ID]
```

Here's an example URL with multiple attributes:

```
/store/products?attributes_id[0]=attr_val_01HDZX4VRNP8PNB3FYJXHAGMWG&attributes_id[1]=attr_val_01HDZX4VRNFF30NDTFZ6TFFH0G
```

### API Reference

#### Entity

```
export enum AttributeType {
  MULTI = "multi", // Allows you to define from 2 up to 5 values in the attribute (configurable).
  SINGLE = "single", // Permits only 1 value in the attribute.
  BOOLEAN = "boolean" // Represents a boolean value (e.g., checkbox).
}
```

Attribute values also have a JSONB metadata field in which you can define any additional values you require. Here's an example:

```
// POST: /admin/attributes

{
    "categories": [
        "pcat_shirts"
    ],
    "description": "Color attribute",
    "handle": "color",
    "name": "Color",
    "type": "multi",
    "values": [
        {
          "rank": 0, // Ranking is used to display values in the desired order.
          "value": "Black",
          "metadata": {
            "color": "#000"
          }
        },
        {
          "rank": 1,
          "value": "White",
          "metadata": {
            "color": "#fff"
          }
        },
    ],
    "max_value_quantity": 3,
    "metadata": {
      "color_attribute": true
    }
}
```

#### Routes

1. `/admin/attributes` (GET) - Get a list of attributes. Parameters: "categories" (category handles). Example: ?categories[0]=t-shirts.

2. `/store/attributes` (GET) - Get a list of attributes with field `filterable` set to `true`. Parameters: "categories" (category handles). Example: ?categories[0]=t-shirts.

3. `/admin/attributes` (POST) - Create a custom attribute.

4. `/admin/attributes/:id` (GET) - Get an attribute by its ID.

5. `/admin/attributes/:id` (POST) - Update an attribute.

6. `/admin/attributes/:id` (DELETE) - Delete an attribute.

#### Global Attributes

To define global attributes that are not tied to specific categories, simply leave the "categories" field empty when creating the attribute.

### Other Links

If you find this plugin useful, please consider giving it a star. Developed by in [Rigby](https://www.linkedin.com/company/rigby-software).
