import { Router } from "express";
import { getConfigFile } from "medusa-core-utils";
import { ConfigModule } from "@medusajs/medusa/dist/types/global";
import bodyParser from "body-parser";
import { errorHandler } from "@medusajs/medusa";
import attributeRouter from "./attribute";
import { registerOverriddenValidators } from "@medusajs/medusa";
import { AdminPostProductsProductReq as MedusaAdminPostProductsProductReq } from "@medusajs/medusa/dist/api/routes/admin/products/update-product";
import { AttributeValueReq } from "./attribute/create-attribute";
import { Type } from "class-transformer";
import { ValidateNested, IsArray } from "class-validator";
import { AttributeValue } from "src/models/attribute-value";

export default (rootDirectory, options) => {
  const router = Router();

  router.use(bodyParser.json());
  router.use(errorHandler());
  router.use(bodyParser.urlencoded({ extended: true }));

  const { configModule } = getConfigFile<ConfigModule>(
    rootDirectory,
    "medusa-config"
  );

  router.use(attributeRouter(configModule));

  return router;
};

class AdminPostProductsProductReq extends MedusaAdminPostProductsProductReq {
  @Type(() => AttributeValueReq)
  @ValidateNested({ each: true })
  @IsArray()
  values: AttributeValue[];
}

registerOverriddenValidators(AdminPostProductsProductReq);
