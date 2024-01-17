import { dataSource } from "@medusajs/medusa/dist/loaders/database";
import {
  FindWithoutRelationsOptions,
  ProductRepository as MedusaProductRepository,
} from "@medusajs/medusa/dist/repositories/product";
import { Product } from "../models/product";
import { cloneDeep } from "lodash";
import { Brackets } from "typeorm";
import { applyOrdering } from "@medusajs/medusa/dist/utils/repository";
import { IntAttributeParam } from "../api";

type AttributesArgument = {
  attributes?: string[];
  int_attributes?: IntAttributeParam;
};

export const ProductRepository = dataSource.getRepository(Product).extend({
  ...MedusaProductRepository,
  async getResultsAndCountWithAttributes(
    q?: string,
    options: FindWithoutRelationsOptions = { where: {} },
    relations: string[] = [],
    { attributes, int_attributes }: AttributesArgument = {}
  ): Promise<[Product[], number]> {
    const option_ = cloneDeep(options);

    const productAlias = "product";
    const pricesAlias = "prices";
    const variantsAlias = "variants";
    const collectionAlias = "collection";
    const tagsAlias = "tags";

    if ("description" in option_.where) {
      delete option_.where.description;
    }

    if ("title" in option_.where) {
      delete option_.where.title;
    }

    const tags = option_.where.tags;
    delete option_.where.tags;

    const price_lists = option_.where.price_list_id;
    delete option_.where.price_list_id;

    const sales_channels = option_.where.sales_channel_id;
    delete option_.where.sales_channel_id;

    const discount_condition_id = option_.where.discount_condition_id;
    delete option_.where.discount_condition_id;

    const categoryId = option_.where.category_id;
    delete option_.where.category_id;

    const includeCategoryChildren = option_?.where?.include_category_children;
    delete option_?.where?.include_category_children;

    const categoriesQuery = option_.where.categories || {};
    delete option_.where.categories;

    let qb = this.createQueryBuilder(`${productAlias}`)
      .leftJoinAndSelect(`${productAlias}.variants`, variantsAlias)
      .leftJoinAndSelect(`${productAlias}.collection`, `${collectionAlias}`)
      .select([`${productAlias}.id`])
      .where(option_.where)
      .skip(option_.skip)
      .take(option_.take);

    if (q) {
      qb.andWhere(
        new Brackets((qb) => {
          qb.where(`${productAlias}.description ILIKE :q`, { q: `%${q}%` })
            .orWhere(`${productAlias}.title ILIKE :q`, { q: `%${q}%` })
            .orWhere(`${variantsAlias}.title ILIKE :q`, { q: `%${q}%` })
            .orWhere(`${variantsAlias}.sku ILIKE :q`, { q: `%${q}%` })
            .orWhere(`${collectionAlias}.title ILIKE :q`, { q: `%${q}%` });
        })
      );
    }

    if (discount_condition_id) {
      qb.innerJoin(
        "discount_condition_product",
        "dc_product",
        `dc_product.product_id = ${productAlias}.id AND dc_product.condition_id = :dcId`,
        { dcId: discount_condition_id }
      );
    }

    if (attributes) {
      qb.leftJoinAndSelect(
        `${productAlias}.attribute_values`,
        "attribute_values"
      );
      qb.leftJoinAndSelect(`attribute_values.attribute`, "attribute");

      qb.andWhere(`attribute_values.id IN (:...values)`, {
        values: attributes,
      });
    }

    if (int_attributes) {
      const filters = Object.entries(int_attributes).reduce(
        (acc, [id, values]) => {
          acc.push({
            fromValue: values[0] || null,
            toValue: values[1] || null,
            attributeId: id,
          });

          return acc;
        },
        []
      );

      filters.forEach(async (filter, index) => {
        const subQuery = this.createQueryBuilder("product")
          .select("product.id as id")
          .leftJoin("product.int_attribute_values", "int_attribute_values")
          .andWhere(`int_attribute_values.attributeId = :attributeId${index}`);

        subQuery.andWhere(
          new Brackets((qb) => {
            qb.where(`int_attribute_values.value >= :fromValue${index}`);

            if (filter.toValue) {
              qb.andWhere(`int_attribute_values.value <= :toValue${index}`);
            }
          })
        );

        qb.andWhere(`product.id IN (${subQuery.getQuery()})`, {
          [`attributeId${index}`]: filter.attributeId,
          [`fromValue${index}`]: filter.fromValue,
          [`toValue${index}`]: filter.toValue,
        });
      });
    }

    if (tags) {
      qb.leftJoin(`${productAlias}.tags`, tagsAlias).andWhere(
        `${tagsAlias}.id IN (:...tag_ids)`,
        {
          tag_ids: tags.value,
        }
      );
    }

    if (price_lists) {
      const variantPricesAlias = `${variantsAlias}_prices`;
      qb.leftJoin(`${productAlias}.variants`, variantPricesAlias)
        .leftJoin(`${variantPricesAlias}.prices`, pricesAlias)
        .andWhere(`${pricesAlias}.price_list_id IN (:...price_list_ids)`, {
          price_list_ids: price_lists.value,
        });
    }

    if (sales_channels) {
      qb.innerJoin(
        `${productAlias}.sales_channels`,
        "sales_channels",
        "sales_channels.id IN (:...sales_channels_ids)",
        { sales_channels_ids: sales_channels.value }
      );
    }

    if (categoriesQuery) {
      const joinScope = {};
      const categoryIds: string[] = await this.getCategoryIdsFromInput(
        categoryId,
        includeCategoryChildren
      );

      if (categoryIds.length) {
        Object.assign(joinScope, { id: categoryIds });
      }

      if (categoriesQuery) {
        Object.assign(joinScope, categoriesQuery);
      }

      this._applyCategoriesQuery(qb, {
        alias: productAlias,
        categoryAlias: "categories",
        where: joinScope,
        joinName: categoryIds.length ? "innerJoin" : "leftJoin",
      });
    }

    const joinedWithTags = !!tags;
    const joinedWithPriceLists = !!price_lists;
    applyOrdering({
      repository: this,
      order: (options.order as any) ?? {},
      qb,
      alias: productAlias,
      shouldJoin: (relation) =>
        relation !== variantsAlias &&
        (relation !== pricesAlias || !joinedWithPriceLists) &&
        (relation !== tagsAlias || !joinedWithTags),
    });

    if (option_.withDeleted) {
      qb = qb.withDeleted();
    }

    const [results, count] = await qb.getManyAndCount();
    const orderedResultsSet = new Set(results.map((p) => p.id));

    const products = await this.findWithRelations(
      relations,
      [...orderedResultsSet],
      option_.withDeleted
    );
    const productsMap = new Map(products.map((p) => [p.id, p]));

    // Looping through the orderedResultsSet in order to maintain the original order and assign the data returned by findWithRelations
    const orderedProducts: Product[] = [];
    orderedResultsSet.forEach((id) => {
      // @ts-ignore
      orderedProducts.push(productsMap.get(id)!);
    });

    return [orderedProducts, count];
  },
  /**
   * `NOTE` Adding existing method due to error in medusa
   */
  async findWithRelationsAndCount(
    relations: string[] = [],
    idsOrOptionsWithoutRelations: FindWithoutRelationsOptions = { where: {} }
  ): Promise<[Product[], number]> {
    return await this._findWithRelations({
      relations,
      idsOrOptionsWithoutRelations,
      withDeleted: false,
      shouldCount: true,
    });
  },
});

export default ProductRepository;
