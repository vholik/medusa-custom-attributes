import { ProductService as MedusaProductService } from "@medusajs/medusa";

type InjectedDependencies = {};

class ProductService extends MedusaProductService {
  constructor(private readonly container: InjectedDependencies) {
    super(arguments[0]);
  }
}

export default ProductService;
