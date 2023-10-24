import { TransactionBaseService } from "@medusajs/medusa";
import { Attribute } from "src/models/attribute";
import { AttributeRepository } from "src/repositories/attribute";
import {
  EntityManager,
  FindManyOptions,
  FindOneOptions,
  ILike,
  In,
  IsNull,
} from "typeorm";
import { MedusaError } from "medusa-core-utils";
import { AdminPostAttributeReq } from "../api/attribute/create-attribute";
import ProductCategoryRepository from "../repositories/product-category";
import { AdminListAttributesReq } from "../api/attribute/list-attributes";

type InjectedDependencies = {
  manager: EntityManager;
  attributeRepository: typeof AttributeRepository;
  productCategoryRepository: typeof ProductCategoryRepository;
};

type ListAndQueryConfig = {
  attributes: { handle: string; value: string[] | string | boolean }[];
};

export const defaultAttributeRelations = ["categories", "values"];

class AttributeService extends TransactionBaseService {
  protected readonly attributeRepository_: typeof AttributeRepository;
  protected readonly productCategoryRepository_: typeof ProductCategoryRepository;

  constructor({
    attributeRepository,
    productCategoryRepository,
  }: InjectedDependencies) {
    super(arguments[0]);
    this.attributeRepository_ = attributeRepository;
    this.productCategoryRepository_ = productCategoryRepository;
  }

  async create(data: AdminPostAttributeReq) {
    const attributeRepo = this.activeManager_.withRepository(
      this.attributeRepository_
    );

    const categories = data.categories.map((c) => ({ id: c }));

    const attribute = attributeRepo.create({
      ...data,
      categories,
    });

    return await attributeRepo.save(attribute);
  }

  /**
   * Method used for building a list and query config object
   * @param config: ListAndQueryConfig
   */
  async prepareListAndQuery(config: ListAndQueryConfig) {
    const whereClause = config.attributes.reduce<Record<string, any>[]>(
      (acc, cur) => {
        if (Array.isArray(cur)) {
          const attribute = {
            handle: cur.handle,
            value: In(cur.value as string[]),
          };

          acc.push(attribute);
        } else {
          const attribute = {
            handle: cur.handle,
            value: cur.value,
          };

          acc.push(attribute);
        }

        return acc;
      },
      []
    );
  }

  async list({ categories }: AdminListAttributesReq) {
    const attributeRepo = this.activeManager_.withRepository(
      this.attributeRepository_
    );

    const config: FindManyOptions<Attribute> = {
      relations: defaultAttributeRelations,
      order: {
        values: {
          rank: "ASC",
        },
      },
    };

    if (categories) {
      config.where = [
        {
          categories: {
            handle: In(categories),
          },
        },
        {
          categories: {
            id: IsNull(),
          },
        },
      ];
    }

    const attributes = await attributeRepo.find(config);

    return attributes;
  }

  async retrieve(
    id: string,
    config?: Omit<FindOneOptions<Attribute>, "where">
  ) {
    const attributeRepo = this.activeManager_.withRepository(
      this.attributeRepository_
    );

    const attribute = await attributeRepo.findOne({
      where: { id },
      ...config,
    });

    if (!attribute) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"Attribute" with id ${id} was not found`
      );
    }

    return attribute;
  }

  async update(id: string, data: Partial<AdminPostAttributeReq>) {
    const attributeRepo = this.activeManager_.withRepository(
      this.attributeRepository_
    );

    const attribute = await this.retrieve(id);

    if (!attribute) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"Attribute" with id ${id} was not found`
      );
    }

    Object.keys(data).forEach((update) => {
      if (update === "categories") {
        const categories = data[update].map((c) => ({ id: c }));

        // @ts-ignore
        attribute["categories"] = categories;

        return;
      }

      attribute[update] = data[update];
    });

    delete attribute.id;

    const createdAttribute = attributeRepo.create(attribute);

    return await attributeRepo.save({ ...createdAttribute, id });
  }

  async delete(id: string) {
    const attributeRepo = this.activeManager_.withRepository(
      this.attributeRepository_
    );

    try {
      return await attributeRepo.delete(id);
    } catch (error) {
      throw new MedusaError(
        MedusaError.Types.DB_ERROR,
        `Failed to delete attribute with id: ${id}`
      );
    }
  }
}

export default AttributeService;
