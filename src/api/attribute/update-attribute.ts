import {
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  IsArray,
  IsNumber,
  ValidateNested,
} from "class-validator";
import { AttributeType } from "../../models/attribute";
import { validator } from "@medusajs/medusa/dist/utils";
import { Type } from "class-transformer";
import AttributeService from "../../services/attribute";
import { AttributeValue } from "../../models/attribute-value";
import { AttributeValueReq } from "./create-attribute";

export default async (req, res) => {
  const validated = await validator(AdminUpdateAttributeReq, req.body);

  const { id } = req.params;

  const attributeService: AttributeService =
    req.scope.resolve("attributeService");

  if (
    validated.type === AttributeType.BOOLEAN &&
    !validated.values?.[0].is_bool
  ) {
    // @ts-ignore
    validated.values = [{ is_bool: true }];
  }

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
  @IsNumber()
  @Type(() => Number)
  max_value_quantity?: number;

  @IsOptional()
  @Type(() => Boolean)
  filterable?: boolean;

  @Type(() => AttributeValueReq)
  @ValidateNested({ each: true })
  @IsArray()
  values: AttributeValue[];

  @IsOptional()
  handle?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @IsOptional()
  @IsString({ each: true })
  categories?: string[];
}
