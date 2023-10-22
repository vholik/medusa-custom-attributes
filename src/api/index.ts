import { getConfigFile, parseCorsOrigins } from "medusa-core-utils";
import { ConfigModule } from "@medusajs/medusa/dist/types/global";
import express, { Router } from "express";
import cors from "cors";
import { wrapHandler } from "@medusajs/medusa";
import createAttribute from "./attribute/create-attribute";
import listAttributes from "./attribute/list-attributes";
import updateAttribute from "./attribute/update-attribute";
import getAttribute from "./attribute/get-attribute";
import deleteAttribute from "./attribute/delete-attribute";

export default (rootDirectory) => {
  const router = Router();
  const { configModule } = getConfigFile<ConfigModule>(
    rootDirectory,
    "medusa-config"
  );

  const { projectConfig } = configModule;

  const storeCors = {
    origin: projectConfig.store_cors.split(","),
    credentials: true,
  };

  const adminCors = {
    origin: projectConfig.admin_cors.split(","),
    credentials: true,
  };

  router.use(express.json());
  router.use(express.urlencoded({ extended: true }));

  // router.options("/admin/attributes", cors(adminCors));
  router.post(
    "/admin/attributes",
    cors(adminCors),
    wrapHandler(require("./create-attribute").default)
  );

  // router.options("/store/attributes", cors(adminCors));
  // router.get("/store/attributes", cors(storeCors), wrapHandler(listAttributes));

  // router.options("/admin/attributes/:id", cors(adminCors));
  // router.post(
  //   "/admin/attributes/:id",
  //   cors(adminCors),
  //   wrapHandler(updateAttribute)
  // );

  // router.get(
  //   "/admin/attributes/:id",
  //   cors(storeCors),
  //   wrapHandler(getAttribute)
  // );

  // router.delete(
  //   "/admin/attributes/:id",
  //   cors(adminCors),
  //   wrapHandler(deleteAttribute)
  // );

  router.get("/hello", (req, res) => {
    res.json({
      message: "Welcome to My Store!",
    });
  });

  return router;
};
