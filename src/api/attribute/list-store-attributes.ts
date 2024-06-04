import { IsOptional, IsString } from "class-validator";
import { validator } from "@medusajs/medusa/dist/utils";
import AttributeService from "../../services/attribute";

export default async (req, res) => {
  const validated = await validator(StoreListAttributesParams, req.query);

  const attributeService: AttributeService =
    req.scope.resolve("attributeService");

  const attributes = await attributeService.list(validated, {
    where: { filterable: true },
    relations: ["values"],
    select: ["id", "name", "values", "type", "handle", "metadata"],
  });

  res.json({ attributes });
};

export class StoreListAttributesParams {
  @IsOptional()
  @IsString({ each: true })
  categories?: string[]; // Categories handle
}
