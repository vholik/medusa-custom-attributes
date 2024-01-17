import { dataSource } from "@medusajs/medusa/dist/loaders/database";
import { ProductRepository as MedusaProductRepository } from "@medusajs/medusa/dist/repositories/product";
import { Product } from "../models/product";

export const ProductRepository = dataSource
  .getRepository(Product)
  .extend(Object.assign(MedusaProductRepository, { target: Product }));

export default ProductRepository;
