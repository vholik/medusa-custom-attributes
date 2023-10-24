export default async function () {
  const imports = (await import(
    "@medusajs/medusa/dist/api/routes/admin/products/index"
  )) as any;
  imports.defaultAdminProductRelations = [
    ...imports.defaultAdminProductRelations,
    "attribute_values",
    "attribute_values.attribute",
  ];
  imports.defaultAdminProductRemoteQueryObject = {
    ...imports.defaultAdminProductRemoteQueryObject,
    attribute_values: {
      relation: "attribute_values",
      fields: ["value", "is_bool", "metadata"],
    },
  };
}
