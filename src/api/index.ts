import { Router } from "express";
import bodyParser from "body-parser";
import { errorHandler } from "@medusajs/medusa";
import attributeRouter from "./attribute";
import { registerOverriddenValidators } from "@medusajs/medusa";
import { AdminPostProductsProductReq as MedusaAdminPostProductsProductReq } from "@medusajs/medusa/dist/api/routes/admin/products/update-product";
import { StoreGetProductsParams as MedusaStoreGetProductsParams } from "@medusajs/medusa/dist/api/routes/store/products/index";
import { Type } from "class-transformer";
import {
  ValidateNested,
  IsArray,
  IsString,
  IsOptional,
  IsNumber,
  IsObject,
} from "class-validator";

export default (rootDirectory, options) => {
  const route = Router();

  route.use(bodyParser.json());
  route.use(errorHandler());
  route.use(bodyParser.urlencoded({ extended: true }));

  const storeCorsOptions = {
    origin: options.projectConfig.store_cors.split(","),
    credentials: true,
  };

  const adminCorsOptions = {
    origin: options.projectConfig.admin_cors.split(","),
    credentials: true,
  };

  attributeRouter(route, { storeCorsOptions, adminCorsOptions });

  return route;
};

class AdminAttributeValueReq {
  @IsString()
  id: string;
}

class AdminIntAttributeValueReq {
  @IsOptional()
  id: string;

  @Type(() => Number)
  @IsNumber()
  value: number;

  @IsString()
  attribute_id: string;
}

class AdminPostProductsProductReq extends MedusaAdminPostProductsProductReq {
  @IsOptional()
  @Type(() => AdminIntAttributeValueReq)
  @ValidateNested({ each: true })
  @IsArray()
  int_attribute_values: AdminIntAttributeValueReq[];

  @IsOptional()
  @Type(() => AdminAttributeValueReq)
  @ValidateNested({ each: true })
  @IsArray()
  attribute_values: AdminAttributeValueReq[];
}

export class StoreGetProductsParams extends MedusaStoreGetProductsParams {
  // TODO: uncomment
  // @IsOptional()
  // @IsObject()
  // int_attributes: Record<string, string[]>;

  @IsOptional()
  @IsString({ each: true })
  attributes_id: string[];
}

registerOverriddenValidators(AdminPostProductsProductReq);
registerOverriddenValidators(StoreGetProductsParams);
