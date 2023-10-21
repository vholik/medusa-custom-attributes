import { IsEnum, IsObject, IsOptional, IsString } from "class-validator";
import { AttributeType } from "src/models/attribute";
import { validator } from "@medusajs/medusa/dist/utils";
import AttributeService from "src/services/attribute";

export default async (req, res) => {
  const validated = await validator(AdminUpdateAttributeReq, req.body);

  const { id } = req.params;

  const attributeService: AttributeService =
    req.scope.resolve("attributeService");

  res.json({ attribute: await attributeService.update(id, validated) });
};

export class AdminUpdateAttributeReq {
  @IsOptional()
  name?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsEnum(AttributeType)
  type?: AttributeType;

  @IsOptional()
  value?: string;

  @IsOptional()
  handle?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @IsOptional()
  @IsString({ each: true })
  category_ids?: string[];
}