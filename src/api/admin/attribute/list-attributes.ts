import { IsOptional, Max } from "class-validator";
import { Type } from "class-transformer";
import { validator } from "@medusajs/medusa/dist/utils";
import AttributeService from "src/services/attribute";

export default async (req, res) => {
  const validated = await validator(AdminListProductsParams, req.query);

  const attributeService: AttributeService =
    req.scope.resolve("attributeService");

  res.json({ attributes: await attributeService.listAndCount(validated) });
};

export class AdminListProductsParams {
  @IsOptional()
  @Type(() => Number)
  @Max(100)
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  offset?: number;

  @IsOptional()
  q?: string;
}
