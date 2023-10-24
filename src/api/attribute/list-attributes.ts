import { IsOptional, IsString } from "class-validator";
import { validator } from "@medusajs/medusa/dist/utils";
import AttributeService from "src/services/attribute";

export default async (req, res) => {
  const validated = await validator(StoreListAttributesReq, req.query);

  const attributeService: AttributeService =
    req.scope.resolve("attributeService");

  res.json(await attributeService.list(validated));
};

export class StoreListAttributesReq {
  @IsOptional()
  @IsString({ each: true })
  categories?: string[]; // Categories handle
}
