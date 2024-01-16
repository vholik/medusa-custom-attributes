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
import { IntAttributeParam } from "../api";
import { MedusaV2Flag } from "@medusajs/utils";

type InjectedDependencies = {
  productRepository: typeof ProductRepository;
  attributeValueRepository: typeof AttributeValueRepository;
  intAttributeValueRepository: typeof IntAttributeValueRepository;
};

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
      attributes: string[];
      int_attributes: IntAttributeParam;
    },
    config: FindProductConfig = {
      relations: [],
      skip: 0,
      take: 20,
      include_discount_prices: false,
    }
  ): Promise<[Product[], number]> {
    const manager = this.activeManager_;
    const productRepo = manager.withRepository(this.productRepository_);

    const attributesArg = {
      attributes: selector.attributes,
      int_attributes: selector.int_attributes,
    };

    delete selector.attributes;
    delete selector.int_attributes;

    const hasSalesChannelsRelation =
      config.relations?.includes("sales_channels");

    if (
      this.featureFlagRouter_.isFeatureEnabled(MedusaV2Flag.key) &&
      hasSalesChannelsRelation
    ) {
      config.relations = config.relations?.filter(
        (r) => r !== "sales_channels"
      );
    }

    const { q, query, relations } = this.prepareListQuery_(selector, config);

    let count: number;
    let products: Product[];

    if (q || attributesArg.attributes || attributesArg.int_attributes) {
      [products, count] = await productRepo.getResultsAndCountWithAttributes(
        q,
        query,
        relations,
        attributesArg
      );
    } else {
      [products, count] = await productRepo.findWithRelationsAndCount(
        relations,
        query
      );
    }

    if (
      this.featureFlagRouter_.isFeatureEnabled(MedusaV2Flag.key) &&
      hasSalesChannelsRelation
    ) {
      // @ts-expect-error
      await this.decorateProductsWithSalesChannels(products);
    }

    return [products, count];
  }
}

export default ProductService;
