import AttributeService, {
  defaultAttributeRelations,
} from "src/services/attribute";

export default async (req, res) => {
  const attributeService: AttributeService =
    req.scope.resolve("attributeService");

  const { id } = req.params;

  res.json({
    attribute: await attributeService.retrieve(id, {
      relations: defaultAttributeRelations,
    }),
  });
};
