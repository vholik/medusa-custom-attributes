import { dataSource } from "@medusajs/medusa/dist/loaders/database";
import { Attribute } from "../models/attribute";

export const AttributeRepository = dataSource.getRepository(Attribute);

export default AttributeRepository;
