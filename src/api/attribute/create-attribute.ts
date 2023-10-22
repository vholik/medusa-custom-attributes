import { IsEnum, IsObject, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";
import { AttributeType } from "../../models/attribute";
import { validator } from "@medusajs/medusa/dist/utils";
import AttributeService from "../../services/attribute";

export default async (req, res) => {
  const validated = await validator(AdminCreateAttributeReq, req.body);
  const attributeService: AttributeService =
    req.scope.resolve("attributeService");

  res.json({ attribute: await attributeService.create(validated) });
};

export class AdminCreateAttributeReq {
  @IsString()
  name: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  @Type(() => Boolean)
  filterable?: boolean;

  @IsEnum(AttributeType)
  type: AttributeType;

  @IsString({ each: true })
  values: string[];

  @IsOptional()
  handle?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>;

  @IsString({ each: true })
  categories: string[];
}
