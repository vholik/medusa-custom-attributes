import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import createAttribute from "../../../controllers/attribute/create-attribute";
import listAttributes from "../../../controllers/attribute/list-attributes";

export const GET = (req: MedusaRequest, res: MedusaResponse) => {
  return listAttributes(req, res);
};

export const POST = (req: MedusaRequest, res: MedusaResponse) => {
  return createAttribute(req, res);
};
