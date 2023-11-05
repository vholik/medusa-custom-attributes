import { dataSource } from "@medusajs/medusa/dist/loaders/database";
import { IntAttributeValue } from "../models/int-attribute-value";

export const IntAttributeValueRepository =
  dataSource.getRepository(IntAttributeValue);

export default IntAttributeValueRepository;
