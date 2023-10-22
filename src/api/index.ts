import { Router } from "express";
import { getConfigFile, parseCorsOrigins } from "medusa-core-utils";
import { ConfigModule } from "@medusajs/medusa/dist/types/global";
import cors from "cors";
import bodyParser from "body-parser";
import createAttribute from "../controllers/attribute/create-attribute";
import { errorHandler } from "@medusajs/medusa";
import { wrapHandler } from "@medusajs/medusa";
import listAttributes from "src/controllers/attribute/list-attributes";

export default (rootDirectory, options) => {
  const router = Router();

  router.use(bodyParser.json());
  router.use(bodyParser.urlencoded({ extended: true }));
  router.use(errorHandler());

  const { configModule } = getConfigFile<ConfigModule>(
    rootDirectory,
    "medusa-config"
  );
  const { projectConfig } = configModule;

  const storeCorsOptions = {
    origin: projectConfig.store_cors.split(","),
    credentials: true,
  };

  const adminCorsOptions = {
    origin: projectConfig.admin_cors.split(","),
    credentials: true,
  };

  router.options("/admin/attributes", cors(adminCorsOptions));
  router.post(
    "/admin/attributes",
    cors(adminCorsOptions),
    wrapHandler(createAttribute)
  );

  // router.options("/store/attributes", cors(storeCorsOptions));
  // router.get(
  //   "/store/attributes",
  //   cors(storeCorsOptions),
  //   wrapHandler(listAttributes)
  // );

  return router;
};
