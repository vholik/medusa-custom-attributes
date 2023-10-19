import { Attribute } from "src/models/attribute";
import { dataSource } from "@medusajs/medusa/dist/loaders/database";

export const AttributeRepository = dataSource.getRepository(Attribute);
