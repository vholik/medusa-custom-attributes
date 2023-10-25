import { Router } from "express";
import bodyParser from "body-parser";
import {
  errorHandler,
  transformStoreQuery,
  wrapHandler,
} from "@medusajs/medusa";
import attributeRouter from "./attribute";
import { registerOverriddenValidators } from "@medusajs/medusa";
import { AdminPostProductsProductReq as MedusaAdminPostProductsProductReq } from "@medusajs/medusa/dist/api/routes/admin/products/update-product";
import {
  StoreGetProductsParams as MedusaStoreGetProductsParams,
  allowedStoreProductsFields,
  allowedStoreProductsRelations,
  defaultStoreProductsFields,
  defaultStoreProductsRelations,
} from "@medusajs/medusa/dist/api/routes/store/products/index";
import { Type } from "class-transformer";
import {
  ValidateNested,
  IsArray,
  IsString,
  IsOptional,
  IsObject,
} from "class-validator";
import { withDefaultSalesChannel } from "@medusajs/medusa/dist/api/middlewares/with-default-sales-channel";
import cors from "cors";
import listProducts from "./products/list-products";
import { FlagRouter } from "@medusajs/utils";

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

  route.options("/store/products", cors(storeCorsOptions));
  route.get(
    "/store/products",
    cors(storeCorsOptions),
    withDefaultSalesChannel({ attachChannelAsArray: true }),
    transformStoreQuery(StoreGetProductsParams, {
      allowedFields: allowedStoreProductsFields,
      allowedRelations: allowedStoreProductsRelations,
      isList: true,
    }),
    wrapHandler(listProducts)
  );

  attributeRouter(route, { storeCorsOptions, adminCorsOptions });

  return route;
};

class AdminAttributeValueReq {
  @IsString()
  id: string;
}

class AdminPostProductsProductReq extends MedusaAdminPostProductsProductReq {
  @IsOptional()
  @Type(() => AdminAttributeValueReq)
  @ValidateNested({ each: true })
  @IsArray()
  attribute_values: AdminAttributeValueReq[];
}

export class StoreGetProductsParams extends MedusaStoreGetProductsParams {
  @IsObject()
  @IsOptional()
  attributes: Record<string, string[] | string>;
}

registerOverriddenValidators(AdminPostProductsProductReq);
registerOverriddenValidators(StoreGetProductsParams);
