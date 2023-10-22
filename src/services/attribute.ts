import { TransactionBaseService } from "@medusajs/medusa";
import { Attribute } from "src/models/attribute";
import { AttributeRepository } from "src/repositories/attribute";
import { EntityManager, FindOneOptions, ILike, In } from "typeorm";
import { MedusaError } from "medusa-core-utils";
import { AdminCreateAttributeReq } from "../controllers/attribute/create-attribute";
import ProductCategoryRepository from "../repositories/product-category";

type InjectedDependencies = {
  manager: EntityManager;
  attributeRepository: typeof AttributeRepository;
  productCategoryRepository: typeof ProductCategoryRepository;
};

type ListAndQueryConfig = {
  attributes: { handle: string; value: string[] | string | boolean }[];
};

export const defaultAttributeRelations = [];

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

  async create(data: AdminCreateAttributeReq) {
    const attributeRepo = this.activeManager_.withRepository(
      this.attributeRepository_
    );

    const values = data.values.map((v) => ({ value: v }));
    const categories = await this.productCategoryRepository_.find({
      where: { id: In(data.categories) },
    });

    const attribute = attributeRepo.create({
      ...data,
      values,
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

  async listAndCount(
    config: { offset?: number; limit?: number; q?: string } = {
      offset: 0,
      limit: 15,
    }
  ) {
    const attributeRepo = this.activeManager_.withRepository(
      this.attributeRepository_
    );

    const { limit, offset, q } = config;

    const [attributes, count] = await attributeRepo.findAndCount({
      skip: offset,
      take: limit,
      relations: defaultAttributeRelations,
      where: {
        name: q ? ILike(`%${q}%`) : undefined,
      },
    });

    return { attributes, count, offset, limit };
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

  async update(id: string, data: Partial<AdminCreateAttributeReq>) {
    const attributeRepo = this.activeManager_.withRepository(
      this.attributeRepository_
    );

    const attribute = await this.retrieve(id);

    Object.keys(data).forEach((update) => {
      if (update === "category_ids") {
        const categories = data[update].map((c) => ({ id: c }));

        // @ts-ignore
        attribute["categories"] = categories;

        return;
      }
      attribute[update] = data[update];
    });

    return await attributeRepo.save(attribute);
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
