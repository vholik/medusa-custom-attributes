## Medusa custom attributes plugin

This plugin is compatible with versions >= 1.8.0 of `@medusajs/medusa`.

## Getting Started

```
npm install medusa-custom-attributes
```

or

```
yarn add medusa-custom-attributes
```

Next add plugin in `medusa-config.js`

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

Now you're good to go! 🚀

## Features

1. Ranking values by drag and drop in admin panel 🤯
2. Filter products by attributes 💪
3. Getting category with attributes 👀

## Why should I use Medusa custom attributes plugin

Medusa custom attributes plugin lets you define custom attributes in categories and use them in products. Plugin let's you filter products by your custom attributes.

## Using plugin

After adding products with custom attributes you can filter them by using query params:

```
?attributes[YOUR_CUSTOM_ATTRIBUTE_HANDLE][0]=YOUR_ATTRIBUTE_VALUE
```

Example:

```
/store/products?attributes[my-custom-attribute-handle][0]=Value+0&attributes[my-custom-attribute-handle][1]=Value+1
```

## Docs

### Entity:

There is a 3 types of attributes:

```
export enum AttributeType {
  MULTI = "multi", // Let's you define up to 2 values in attribute
  SINGLE = "single", // Let's you define only 1 value in attribute
  BOOLEAN = "boolean" // boolean value (example: checkbox)
}
```

Attribute values also has a JSONB metadata field in which you can define whatever values you want:

```
{
    "categories": [
        "pcat_shirts"
    ],
    "description": "Color attribute",
    "filterable": true,
    "handle": "color",
    "name": "Color",
    "type": "multi",
    "values": [
        {
          "rank": 0, // Ranking is used to display in accurate order
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
    "metadata": {
      "color_attribute": true
    }
}
```

### API:

### Global attributes

To define global attributes just leave categories field empty.

## Other links

If you're liking using plugin don't hesitate to give it a star. Developed in [Rigby](https://www.linkedin.com/company/rigby-software).
