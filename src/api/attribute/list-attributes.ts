import { IsOptional, IsString } from "class-validator";
import { validator } from "@medusajs/medusa/dist/utils";
import AttributeService from "../../services/attribute";
import { RegionService, UserService } from "@medusajs/medusa";

export default async (req, res) => {
  const validated = await validator(AdminListAttributesParams, req.query);

  const attributeService: AttributeService =
    req.scope.resolve("attributeService");

  res.json(await attributeService.list(validated));
};

export class AdminListAttributesParams {
  @IsOptional()
  @IsString({ each: true })
  categories?: string[]; // Categories handle
}
