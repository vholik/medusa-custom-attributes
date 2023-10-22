import { Router } from "express";
import { ConfigModule, wrapHandler } from "@medusajs/medusa";
import cors from "cors";

export default (options: ConfigModule) => {
  const attributeRouter = Router();

  const storeCorsOptions = {
    origin: options.projectConfig.store_cors.split(","),
    credentials: true,
  };

  const adminCorsOptions = {
    origin: options.projectConfig.admin_cors.split(","),
    credentials: true,
  };

  attributeRouter.options("/store/attributes", cors(storeCorsOptions));
  attributeRouter.get(
    "/store/attributes",
    cors(storeCorsOptions),
    wrapHandler(require("./list-attributes").default)
  );

  attributeRouter.options("/admin/attributes", cors(adminCorsOptions));
  attributeRouter.post(
    "/admin/attributes",
    cors(adminCorsOptions),
    wrapHandler(require("./create-attribute").default)
  );

  attributeRouter.options("/store/attributes/:id", cors(storeCorsOptions));
  attributeRouter.post(
    "/store/attributes/:id",
    cors(storeCorsOptions),
    wrapHandler(require("./get-attribute").default)
  );

  attributeRouter.options("/admin/attributes/:id", cors(adminCorsOptions));
  attributeRouter.post(
    "/admin/attributes/:id",
    cors(adminCorsOptions),
    wrapHandler(require("./update-attribute").default)
  );

  attributeRouter.options("/admin/attributes/:id", cors(adminCorsOptions));
  attributeRouter.delete(
    "/admin/attributes/:id",
    cors(adminCorsOptions),
    wrapHandler(require("./delete-attribute").default)
  );

  return attributeRouter;
};
