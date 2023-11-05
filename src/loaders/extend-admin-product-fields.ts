export default async function (container) {
  const userRepo = container.resolve("userRepository");

  console.log(await userRepo.find());

  const imports = (await import(
    "@medusajs/medusa/dist/api/routes/admin/products/index"
  )) as any;
  imports.defaultAdminProductRelations = [
    ...imports.defaultAdminProductRelations,
    "attribute_values",
    "int_attribute_values",
    "attribute_values.attribute",
    "int_attribute_values.attribute",
  ];
  imports.defaultAdminProductRemoteQueryObject = {
    ...imports.defaultAdminProductRemoteQueryObject,
    attribute_values: {
      relation: "attribute_values",
      fields: ["value", "metadata"],
    },
    int_attribute_values: {
      relation: "int_attribute_values",
      fields: ["value"],
    },
  };
}
