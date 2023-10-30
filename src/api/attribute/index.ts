import { Router } from "express";
import { wrapHandler } from "@medusajs/medusa";
import cors from "cors";

const route = Router();

export default (app, options) => {
  app.use("/", route);

  const { storeCorsOptions, adminCorsOptions } = options;

  route.options("/store/attributes", cors(storeCorsOptions));
  route.get(
    "/store/attributes/",
    cors(storeCorsOptions),
    wrapHandler(require("./list-store-attributes").default)
  );

  route.options("/admin/attributes", cors(adminCorsOptions));
  route.get(
    "/admin/attributes/",
    cors(adminCorsOptions),
    wrapHandler(require("./list-attributes").default)
  );

  route.post(
    "/admin/attributes",
    cors(adminCorsOptions),
    wrapHandler(require("./create-attribute").default)
  );

  route.options("/admin/attributes/:id", cors(adminCorsOptions));
  route.get(
    "/admin/attributes/:id",
    cors(adminCorsOptions),
    wrapHandler(require("./get-attribute").default)
  );

  route.options("/admin/attributes/:id", cors(adminCorsOptions));
  route.post(
    "/admin/attributes/:id",
    cors(adminCorsOptions),
    wrapHandler(require("./update-attribute").default)
  );

  route.delete(
    "/admin/attributes/:id",
    cors(adminCorsOptions),
    wrapHandler(require("./delete-attribute").default)
  );

  return app;
};
