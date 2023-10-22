import { Router } from "express";
import { getConfigFile, parseCorsOrigins } from "medusa-core-utils";
import { ConfigModule } from "@medusajs/medusa/dist/types/global";
import bodyParser from "body-parser";
import { errorHandler } from "@medusajs/medusa";
import attributeRouter from "./attribute";
import { config } from "dotenv";

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

// router.options("/admin/attributes", cors(adminCorsOptions));
// router.post(
//   "/admin/attributes",
//   cors(adminCorsOptions),
//   wrapHandler(createAttribute)
// );
