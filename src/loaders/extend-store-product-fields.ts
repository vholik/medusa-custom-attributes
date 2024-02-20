export default async function () {
  const imports = (await import(
    "@medusajs/medusa/dist/api/routes/store/products/index"
  )) as any;
  imports.allowedStoreProductsRelations = [
    ...imports.allowedStoreProductsRelations,
    "custom_attributes",
  ];
  imports.defaultStoreProductsRelations = [
    ...imports.defaultStoreProductsRelations,
    "attribute_values",
    "attribute_values.attribute",
    "int_attribute_values",
    "int_attribute_values.attribute",
  ];
}
