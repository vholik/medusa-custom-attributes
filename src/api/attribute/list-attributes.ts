import { IsOptional, Max } from "class-validator";
import { Type } from "class-transformer";
import { validator } from "@medusajs/medusa/dist/utils";
import AttributeService from "src/services/attribute";

export default async (req, res) => {
  const attributeService: AttributeService =
    req.scope.resolve("attributeService");

  res.json(await attributeService.list());
};
