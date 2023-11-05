import {
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
  IsNumber,
} from "class-validator";
import { Type } from "class-transformer";
import { AttributeType } from "../../models/attribute";
import { validator } from "@medusajs/medusa/dist/utils";
import AttributeService from "../../services/attribute";
import { AttributeValue } from "../../models/attribute-value";

export default async (req, res) => {
  try {
    const validated = await validator(AdminPostAttributeReq, req.body);
    const attributeService: AttributeService =
      req.scope.resolve("attributeService");

    res.json({ attribute: await attributeService.create(validated) });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export class AttributeValueReq {
  @IsString()
  @IsOptional()
  id: string;

  @IsString()
  @IsOptional()
  value: string;

  @IsNumber()
  @Type(() => Number)
  rank: number;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>;
}

export class AdminPostAttributeReq {
  @IsString()
  name: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  @Type(() => Boolean)
  filterable?: boolean;

  @IsEnum(AttributeType)
  type: AttributeType;

  @Type(() => AttributeValueReq)
  @ValidateNested({ each: true })
  @IsArray()
  values: AttributeValue[];

  @IsOptional()
  handle?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>;

  @IsString({ each: true })
  categories: string[];
}
