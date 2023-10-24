export default async function () {
  const imports = (await import(
    "@medusajs/medusa/dist/api/routes/store/products/index"
  )) as any;
  imports.allowedStoreProductsRelations = [
    ...imports.allowedStoreProductsRelations,
    "attribute_values",
    "attribute_values.attribute",
  ];
  imports.defaultStoreProductsRelations = [
    ...imports.defaultStoreProductsRelations,
    "attribute_values",
    "attribute_values.attribute",
  ];
}
