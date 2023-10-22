import {
  ProductService as MedusaProductService,
  Selector,
  buildQuery,
} from "@medusajs/medusa";
import ProductRepository from "../repositories/product";
import { Product } from "@medusajs/medusa/dist/models";
import {
  ProductSelector,
  FindProductConfig,
} from "@medusajs/medusa/dist/types/product";

type InjectedDependencies = {
  productRepository: typeof ProductRepository;
};

class ProductService extends MedusaProductService {
  protected readonly productRepository_: typeof ProductRepository;

  constructor(private readonly container: InjectedDependencies) {
    super(arguments[0]);
    this.productRepository_ = container.productRepository;
  }

  async listAndCount(
    selector: ProductSelector,
    config?: FindProductConfig
  ): Promise<[Product[], number]> {
    return await super.listAndCount(selector, config);
  }
}

export default ProductService;
