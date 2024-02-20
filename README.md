# Medusa Custom Attributes Plugin

# Tutorials

Here is some articles how to add custom attributes and handle them on storefont:

1. [How to add attributes in admin panel](https://medium.com/rigby-software-house/adding-custom-attributes-in-medusa-js-ba1af9f312bb)
2. [How to handle attributes on storefront](https://medium.com/rigby-software-house/introducing-custom-attributes-in-medusa-js-part-2-ui-8c1f111f8845)

https://github.com/vholik/medusa-custom-attributes/assets/109461604/75d826ea-9725-4a8d-a35d-c264740abc44

The Medusa Custom Attributes Plugin is designed to enhance your e-commerce platform with custom attributes, providing compatibility with versions >= 1.20.0 of `@medusajs/medusa`.

## Features

1. **Diverse Attribute Types**: The plugin supports multi, single, range and boolean attributes, enabling a wide range of attribute customizations. 🤯
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

```bash
yarn add medusa-custom-attributes
```

(Optional) Next toggle categories feature flag to your .env:

```dotenv
MEDUSA_FF_PRODUCT_CATEGORIES=true
```

### Configuration

Next, add the plugin to your medusa-config.js file as follows:

```js
const plugins = [
  // ...
  {
    resolve: `medusa-custom-attributes`,
    options: {
      enableUI: true,
      projectConfig: {
        store_cors: STORE_CORS,
        admin_cors: ADMIN_CORS,
      },
    },
  },
];
```

And run migrations:

```bash
npx medusa migrations run
```

Now you're all set and ready to launch! 🚀

### Why Use the Medusa Custom Attributes Plugin?

The Medusa Custom Attributes Plugin empowers you to define custom attributes within categories and apply them to your products. With this plugin, you can filter your products based on these custom attributes, offering a more tailored shopping experience for your customers.

### Using on storefront

To get custom attributes make a `/store/attributes` request. If you want to get attributes that is related to certain categories use `/store/attributes?categories[]=CATEGORY_HANDLE` param

After adding custom attributes to product, you can see field `attribute_values` in product responses. Also, you can filter them using query parameters in the URL. For example:

```bash
/store/products?attributes[]=ATTRIBUTE_VAL_ID
```

Here's an example URL:

```bash
/store/products?attributes[]=attr_val_01HDZX4VRNP8PNB3FYJXHAGMWG&attributes[]=attr_val_BQDHQ342NB3FYJXHA4353
```

this corresponds to the following Axios request:

```jsx
axios.get("http://localhost:9000/store/products", {
  params: {
    attributes: [
      "attr_val_01HDZX4VRNP8PNB3FYJXHAGMWG",
      "attr_val_BQDHQ342NB3FYJXHA4353",
    ],
  },
});
```

### Using range attributes

As range attribute is a different table you should use different query to filter products by range attributes:

```bash
/store/products?int_attributes[RANGE_ATTRIBUTE_ID][]=0&int_attributes[RANGE_ATTRIBUTE_ID][]=61 // Range from 0 to 61 (included)
```

Here is an URL example with using range attributes:

```bash
/store/products?int_attributes[attr_01HEJ929XKX88616FYER0SM165][]=0&int_attributes[attr_01HEJ929XKX88616FYER0SM165][]=61
```

this corresponds to the following Axios request:

```jsx
axios.get("http://localhost:9000/store/products", {
  params: {
    int_attributes: {
      attr_01HEJ929XKX88616FYER0SM165: [0, 61],
    },
  },
});
```

In response we get:

```json
{
  // ...product fields
  "custom_attributes": [
    {
      "id": "attr_01HEJ929XKX88616FYER0SM165",
      "created_at": "2023-11-06T12:17:38.228Z",
      "updated_at": "2023-11-06T12:17:38.228Z",
      "name": "Custom attribute",
      "description": "",
      "type": "range",
      "handle": "range-test",
      "filterable": true,
      "metadata": null,
      "value": {
        "id": "int_attr_val_01HEN6GZ3C1X7Q11Y7XXZJHNTY",
        "created_at": "2023-11-07T14:30:55.792Z",
        "updated_at": "2023-11-07T14:30:55.792Z",
        "value": 61
      }
    },
    {
      "id": "attr_01HEN6HFFF0KEMNT1Y70GYM66F",
      "created_at": "2023-11-07T15:31:13.008Z",
      "updated_at": "2023-11-07T15:31:13.008Z",
      "name": "Custom attribute 2",
      "description": "",
      "type": "range",
      "handle": "custom-attribute-2",
      "filterable": true,
      "metadata": null,
      "value": {
        "id": "int_attr_val_01HEN738CKGVZ0AWDHTH2SJBR4",
        "created_at": "2023-11-07T14:40:55.070Z",
        "updated_at": "2023-11-07T14:40:55.070Z",
        "value": 60
      }
    }
  ]
}
```

### API Reference

#### Entity

```tsx
export enum AttributeType {
  MULTI = "multi", // Allows you to define several attribute values from the same attribute.
  SINGLE = "single", // Permits only 1 value from the attribute.
  BOOLEAN = "boolean", // Represents a boolean value (e.g., checkbox).
  RANGE = "range", // Integer
}
```

Attribute values also have a JSONB metadata field in which you can define any additional values you require. Here's an example:

```json
// POST: /admin/attributes

{
  "categories": ["pcat_shirts"],
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
    }
  ],
  "metadata": {
    "color_attribute": true
  }
}
```

### API Routes

1. `/admin/attributes` (GET) - Get a list of attributes. Parameters: "categories" (category handles). Example: ?categories[0]=t-shirts.

2. `/store/attributes` (GET) - Get a list of attributes with field `filterable` set to `true`. Parameters: "categories" (category handles). Example: ?categories[0]=t-shirts.

3. `/admin/attributes` (POST) - Create a custom attribute.

4. `/admin/attributes/:id` (GET) - Get an attribute by its ID.

5. `/admin/attributes/:id` (POST) - Update an attribute.

6. `/admin/attributes/:id` (DELETE) - Delete an attribute.

### Global Attributes

To define global attributes that are not tied to specific categories, simply leave the "categories" field empty when creating the attribute.

### Changelog

- 2/20/202: Replacing `int_attribute_values` and `attribute_values` with simple `custom_attributes`.
- 1/16/2023: Updating plugin to the latest version of Medusajs (1.20.0), improve performance on filtering, refactoring code, change attributes filtering
- 11/8/2023: Adding range attribute, fix attributes filter bug
- 11/3/2023: Remove is_bool field in attribute_value model, fixing minor bugs

### Other Links

If you find this plugin useful, please consider giving it a star. Developed by in [Rigby](https://www.linkedin.com/company/rigby-software).
