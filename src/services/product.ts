import { ProductService as MedusaProductService } from "@medusajs/medusa";
import ProductRepository from "../repositories/product";
import { Product } from "@medusajs/medusa/dist/models";
import { FindProductConfig } from "@medusajs/medusa/dist/types/product";
import AttributeValueRepository from "../repositories/attribute-value";
import ProductCategories from "@medusajs/medusa/dist/loaders/feature-flags/product-categories";
import SalesChannels from "@medusajs/medusa/dist/loaders/feature-flags/sales-channels";
import { StoreGetProductsParams } from "../api";
import { SelectQueryBuilder } from "typeorm";

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

  // Overiding listAndCount method to queryBuilder
  // due to limitation of AND operator in typeorm
  async listAndCountQueryBuilder(
    selector: StoreGetProductsParams,
    config?: FindProductConfig
  ): Promise<[Product[], number]> {
    const {
      category_id,
      collection_id,
      handle,
      id,
      is_giftcard,
      limit,
      offset,
      q,
      tags,
      title,
      sales_channel_id,
      attributes,
    } = selector;

    const manager = this.activeManager_;
    const productRepo = manager.withRepository(this.productRepository_);

    const isCategories = this.featureFlagRouter_.isFeatureEnabled(
      ProductCategories.key
    );

    const isSalesChannels = this.featureFlagRouter_.isFeatureEnabled(
      SalesChannels.key
    );

    const queryBuilder = productRepo
      .createQueryBuilder("product")
      .select(selects)
      .leftJoinAndSelect("product.variants", "variants")
      .leftJoinAndSelect("variants.prices", "prices")
      .leftJoinAndSelect("variants.options", "options")
      .leftJoinAndSelect("product.attribute_values", "attribute_values")
      .leftJoinAndSelect("attribute_values.attribute", "attribute")
      .leftJoinAndSelect("product.images", "images")
      .leftJoinAndSelect("product.tags", "tags")
      .leftJoinAndSelect("product.collection", "collection")
      .leftJoinAndSelect("product.profiles", "profiles")
      .where("product.status = :status", { status: "published" })
      .andWhere(`categories.is_internal = 'false'`)
      .andWhere(`categories.is_active = 'true'`)
      .orderBy("product.created_at", "DESC");

    queryBuilder.andWhere("attribute_values.value = :value", {
      value: "Western",
    });

    queryBuilder.andWhere("attribute.handle = :value", {
      value: "style",
    });

    if (attributes) {
      for (const attributeHandle in attributes) {
        queryBuilder.andWhere("attribute.handle = :attributeHandle", {
          attributeHandle,
        });
        queryBuilder.andWhere("attribute_values.value = :attributeValue", {
          attributeValue: "Western",
        });
      }
    }

    if (isSalesChannels) {
      queryBuilder.leftJoinAndSelect(
        "product.sales_channels",
        "sales_channels"
      );
    }

    if (isCategories) {
      queryBuilder.leftJoinAndSelect("product.categories", "categories");
    }

    if (category_id) {
      queryBuilder.andWhere("categories.id IN (:...category_id)", {
        category_id,
      });
    }

    if (collection_id) {
      queryBuilder.andWhere("collection.id IN (:...collection_id)", {
        collection_id,
      });
    }

    if (handle) {
      queryBuilder.andWhere("product.handle = :handle", { handle });
    }

    if (id) {
      queryBuilder.andWhere("product.id = :id", { id });
    }

    if (is_giftcard) {
      queryBuilder.andWhere("product.is_giftcard = :is_giftcard", {
        is_giftcard,
      });
    }

    if (q) {
      queryBuilder.andWhere("product.title ILIKE :q", { q: `%${q}%` });
      queryBuilder.orWhere("product.subtitle ILIKE :q", { q: `%${q}%` });
    }

    if (tags) {
      queryBuilder.andWhere("tags.value IN (:...tags)", { tags });
    }

    if (title) {
      queryBuilder.andWhere("product.title = :title", { title });
    }

    if (sales_channel_id) {
      queryBuilder.andWhere("sales_channels.id IN (:...sales_channel_id)");
    }

    queryBuilder.take(limit).skip(offset);

    return await queryBuilder.getManyAndCount();
  }
}

export default ProductService;
