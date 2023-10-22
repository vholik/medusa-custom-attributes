import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import getAttribute from "../../../../controllers/attribute/get-attribute";

export const GET = (req: MedusaRequest, res: MedusaResponse) => {
  return getAttribute(req, res);
};
