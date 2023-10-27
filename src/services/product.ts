import { ProductService as MedusaProductService } from "@medusajs/medusa";
import ProductRepository from "../repositories/product";
import { Product } from "@medusajs/medusa/dist/models";
import {
  FindProductConfig,
  ProductSelector,
} from "@medusajs/medusa/dist/types/product";
import AttributeValueRepository from "../repositories/attribute-value";
import { And, Equal } from "typeorm";

type InjectedDependencies = {
  productRepository: typeof ProductRepository;
  attributeValueRepository: typeof AttributeValueRepository;
};

const selects = [
  "product.id",
  "product.external_id",
  "product.title",
  "product.subtitle",
  "product.status",
  "product.description",
  "product.handle",
  "product.thumbnail",
  "product.created_at",
  "product.metadata",
  "product.deleted_at",
  "product.is_giftcard",
  "product.discountable",
  "product.type",
];

class ProductService extends MedusaProductService {
  protected readonly productRepository_: typeof ProductRepository;
  protected readonly attributeValueRepository_: typeof AttributeValueRepository;

  constructor(private readonly container: InjectedDependencies) {
    super(arguments[0]);
    this.productRepository_ = container.productRepository;
    this.attributeValueRepository_ = container.attributeValueRepository;
  }

  async listAndCount(
    selector: ProductSelector & { attributes: string[] },
    config?: FindProductConfig
  ): Promise<[Product[], number]> {
    const manager = this.activeManager_;
    const productRepo = manager.withRepository(this.productRepository_);

    const attributes = selector.attributes;

    const { q, query, relations } = this.prepareListQuery_(selector, config);

    // @ts-ignore
    query.where.attributes = attributes;

    return await productRepo.getFreeTextSearchResultsAndCount(
      q,
      query,
      relations
    );
  }
}

export default ProductService;
