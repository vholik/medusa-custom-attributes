import { ProductCategory } from "../models/product-category";
import { dataSource } from "@medusajs/medusa/dist/loaders/database";
import { ProductCategoryRepository as MedusaProductCategoryRepository } from "@medusajs/medusa/dist/repositories/product-category";

export const ProductCategoryRepository = dataSource
  .getTreeRepository(ProductCategory)
  .extend({
    ...MedusaProductCategoryRepository,
  });

export default ProductCategoryRepository;
