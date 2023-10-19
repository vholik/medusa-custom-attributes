import AttributeService, {
  defaultAttributeRelations,
} from "src/services/attribute";

export default async (req, res) => {
  const attributeService: AttributeService =
    req.scope.resolve("attributeService");

  const { id } = req.params;

  const attribute = await attributeService.delete(id);

  res.sendStatus(200);
};
