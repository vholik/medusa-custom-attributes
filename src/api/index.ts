import { Router } from "express";
import bodyParser from "body-parser";
import { errorHandler } from "@medusajs/medusa";
import attributeRouter from "./attribute";
import { registerOverriddenValidators } from "@medusajs/medusa";
import { AdminPostProductsProductReq as MedusaAdminPostProductsProductReq } from "@medusajs/medusa/dist/api/routes/admin/products/update-product";
import { Type } from "class-transformer";
import { ValidateNested, IsArray, IsString, IsOptional } from "class-validator";

export default (rootDirectory, options) => {
  const router = Router();

  router.use(bodyParser.json());
  router.use(errorHandler());
  router.use(bodyParser.urlencoded({ extended: true }));

  const storeCorsOptions = {
    origin: options.projectConfig.store_cors.split(","),
    credentials: true,
  };

  const adminCorsOptions = {
    origin: options.projectConfig.admin_cors.split(","),
    credentials: true,
  };

  attributeRouter(router, { storeCorsOptions, adminCorsOptions });

  return router;
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
  values: AdminAttributeValueReq[];
}

registerOverriddenValidators(AdminPostProductsProductReq);
