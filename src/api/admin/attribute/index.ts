import { Router } from "express";
import middlewares from "@medusajs/medusa/dist/api/middlewares";

const route = Router();

export default (app) => {
  app.use("/attribute", route);

  route.post("/", middlewares.wrap(require("./create-attribute").default));

  route.get("/", middlewares.wrap(require("./list-attributes").default));

  route.post("/:id", middlewares.wrap(require("./edit-attribute").default));

  route.get("/:id", middlewares.wrap(require("./get-attribute").default));

  route.delete("/:id", middlewares.wrap(require("./delete-attribute").default));

  return app;
};
