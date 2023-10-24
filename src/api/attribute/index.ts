import { Router } from "express";
import { ConfigModule, wrapHandler } from "@medusajs/medusa";
import cors from "cors";

const route = Router();

export default (app, options) => {
  app.use("/admin/attributes", route);

  const { storeCorsOptions, adminCorsOptions } = options;

  route.options("/", cors(storeCorsOptions));
  route.get(
    "/",
    cors(storeCorsOptions),
    wrapHandler(require("./list-attributes").default)
  );

  route.post(
    "/",
    cors(adminCorsOptions),
    wrapHandler(require("./create-attribute").default)
  );

  route.options("/:id", cors(storeCorsOptions));
  route.post(
    "/:id",
    cors(storeCorsOptions),
    wrapHandler(require("./get-attribute").default)
  );

  route.options("/:id", cors(adminCorsOptions));
  route.post(
    "/:id",
    cors(adminCorsOptions),
    wrapHandler(require("./update-attribute").default)
  );

  route.delete(
    "/:id",
    cors(adminCorsOptions),
    wrapHandler(require("./delete-attribute").default)
  );

  return app;
};
