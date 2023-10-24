import { registerOverriddenValidators } from "@medusajs/medusa";
import { AdminPostProductsProductReq as MedusaAdminPostProductsProductReq } from "@medusajs/medusa/dist/api/routes/admin/products/update-product";
import { Type } from "class-transformer";
import { ValidateNested, IsArray } from "class-validator";
import { Attribute } from "../models/attribute";

class AdminPostProductsProductReq extends MedusaAdminPostProductsProductReq {
  @Type(() => Attribute)
  @ValidateNested({ each: true })
  @IsArray()
  attributes: Attribute[];
}

export default async function () {
  console.log("siema FROM VALIDATOR !!!");

  registerOverriddenValidators(AdminPostProductsProductReq);
}
