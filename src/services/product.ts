import { ProductService as MedusaProductService } from "@medusajs/medusa";
import ProductRepository from "../repositories/product";
import { Product } from "@medusajs/medusa/dist/models";
import {
  FindProductConfig,
  ProductSelector,
  UpdateProductInput,
} from "@medusajs/medusa/dist/types/product";
import AttributeValueRepository from "../repositories/attribute-value";
import IntAttributeValueRepository from "../repositories/int-attribute-value";

type InjectedDependencies = {
  productRepository: typeof ProductRepository;
  attributeValueRepository: typeof AttributeValueRepository;
  intAttributeValueRepository: typeof IntAttributeValueRepository;
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
  protected readonly intAttributeValueRepository: typeof IntAttributeValueRepository;
  protected readonly attributeValueRepository_: typeof AttributeValueRepository;

  constructor(private readonly container: InjectedDependencies) {
    super(arguments[0]);
    this.productRepository_ = container.productRepository;
    this.attributeValueRepository_ = container.attributeValueRepository;
    this.intAttributeValueRepository = container.intAttributeValueRepository;
  }

  async update(
    productId: string,
    update: UpdateProductInput & {
      int_attribute_values?: Record<string, any>[];
    }
  ) {
    const manager = this.activeManager_;
    const intAttributeValueRepo = manager.withRepository(
      this.intAttributeValueRepository
    );

    if (update.int_attribute_values) {
      update.int_attribute_values = update.int_attribute_values.map((v) => {
        const toCreate = intAttributeValueRepo.create({
          id: v.id,
          value: v.value,
          attribute: {
            id: v.attribute_id,
          },
        });

        return toCreate;
      });
    }

    return await super.update(productId, update);
  }

  async listAndCount(
    selector: ProductSelector & {
      attributes_id: string[];
      int_attributes: Record<string, number>;
    },
    config?: FindProductConfig
  ): Promise<[Product[], number]> {
    const manager = this.activeManager_;
    const productRepo = manager.withRepository(this.productRepository_);

    const { q, query, relations } = this.prepareListQuery_(selector, config);

    // @ts-ignore
    query.where.attributes_id = selector.attributes_id;
    // @ts-ignore
    query.where.int_attributes = selector.int_attributes;

    return await productRepo.customGetFreeTextSearchResultsAndCount(
      q,
      query,
      relations
    );
  }
}

export default ProductService;
