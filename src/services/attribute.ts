import { TransactionBaseService } from "@medusajs/medusa";
import { Attribute } from "src/models/attribute";
import { AttributeRepository } from "src/repositories/attribute";
import { EntityManager, FindOneOptions, ILike, In } from "typeorm";
import { MedusaError } from "medusa-core-utils";
import { AdminCreateAttributeReq } from "../api/attribute/create-attribute";
import ProductCategoryRepository from "../repositories/product-category";

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

  async create(data: AdminCreateAttributeReq) {
    const attributeRepo = this.activeManager_.withRepository(
      this.attributeRepository_
    );

    const values = data.values.map((v) => ({ value: v }));
    const categories = data.categories.map((c) => ({ id: c }));

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

  async list() {
    const attributeRepo = this.activeManager_.withRepository(
      this.attributeRepository_
    );

    const attributes = await attributeRepo.find({
      relations: defaultAttributeRelations,
    });

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

  async update(id: string, data: Partial<AdminCreateAttributeReq>) {
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

      if (update === "values") {
        const values = data[update].map((v) => ({ value: v }));

        // @ts-ignore
        attribute["values"] = values;

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
