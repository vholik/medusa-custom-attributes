import { dataSource } from "@medusajs/medusa/dist/loaders/database";
import { ProductRepository as MedusaProductRepository } from "@medusajs/medusa/dist/repositories/product";
import { ProductCategory } from "../models/product-category";

export const ProductRepository = dataSource
  .getTreeRepository(ProductCategory)
  .extend({
    ...Object.assign(MedusaProductRepository, {
      target: MedusaProductRepository,
    }),
  });

export default ProductRepository;
