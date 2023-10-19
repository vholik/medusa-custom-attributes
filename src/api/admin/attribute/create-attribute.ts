import { IsEnum, IsObject, IsOptional, IsString } from "class-validator";
import { AttributeType } from "src/models/attribute";
import { validator } from "@medusajs/medusa/dist/utils";
import AttributeService from "src/services/attribute";

export default async (req, res) => {
  const validated = await validator(AdminCreateAttributeReq, req.body);

  const attributeService: AttributeService =
    req.scope.resolve("attributeService");

  res.json({ attribute: await attributeService.create(validated) });
};

export class AdminCreateAttributeReq {
  @IsOptional()
  name?: string;

  @IsOptional()
  description?: string;

  @IsEnum(AttributeType)
  type: AttributeType;

  value: string;

  @IsOptional()
  handle?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>;

  @IsString({ each: true })
  category_ids: string[];
}
