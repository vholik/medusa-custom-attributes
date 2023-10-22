import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import createAttribute from "../../controllers/attribute/create-attribute";

export const POST = (req: MedusaRequest, res: MedusaResponse) => {
  return createAttribute(req, res);
};
