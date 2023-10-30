import { dataSource } from "@medusajs/medusa/dist/loaders/database";
import {
  FindWithoutRelationsOptions,
  ProductRepository as MedusaProductRepository,
} from "@medusajs/medusa/dist/repositories/product";
import { Product } from "../models/product";
import { cloneDeep } from "lodash";
import { Brackets } from "typeorm";
import { applyOrdering } from "@medusajs/medusa/dist/utils/repository";
import { AttributeType } from "../models/attribute";

export const ProductRepository = dataSource.getTreeRepository(Product).extend({
  ...Object.assign(MedusaProductRepository, {
    target: Product,
  }),

  async getFreeTextSearchResultsAndCount(
    q: string,
    options: FindWithoutRelationsOptions = { where: {} },
    relations: string[] = []
  ): Promise<[Product[], number]> {
    const attributes_id: string[] =
      // @ts-ignore
      options.where.attributes_id;
    // @ts-ignore
    delete options.where.attributes_id;

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

    if (attributes_id) {
      qb.leftJoinAndSelect(
        `${productAlias}.attribute_values`,
        "attribute_value"
      );
      qb.leftJoinAndSelect(`attribute_value.attribute`, "attribute");

      attributes_id.forEach((id) => {
        qb.andWhere(`attribute_value.id = :id`, {
          id,
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
});

export default ProductRepository;
