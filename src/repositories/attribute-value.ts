import { dataSource } from "@medusajs/medusa/dist/loaders/database";
import { AttributeValue } from "../models/attribute-value";

export const AttributeValueRepository =
  dataSource.getRepository(AttributeValue);

export default AttributeValueRepository;
