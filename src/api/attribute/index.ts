import { Router } from "express";
import { wrapHandler } from "@medusajs/medusa";
import cors from "cors";

const route = Router();

export default (app, options) => {
  app.use("/admin/attributes", route);

  const { storeCorsOptions, adminCorsOptions } = options;

  route.options("/", cors(adminCorsOptions));
  route.get(
    "/",
    cors(adminCorsOptions),
    wrapHandler(require("./list-attributes").default)
  );

  route.post(
    "/",
    cors(adminCorsOptions),
    wrapHandler(require("./create-attribute").default)
  );

  route.options("/:id", cors(adminCorsOptions));
  route.get(
    "/:id",
    cors(adminCorsOptions),
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
