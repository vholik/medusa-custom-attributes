import { TransactionBaseService } from "@medusajs/medusa";
import { Attribute } from "../models/attribute";
import { AttributeRepository } from "../repositories/attribute";
import {
  EntityManager,
  FindManyOptions,
  FindOneOptions,
  In,
  IsNull,
  Not,
} from "typeorm";
import { MedusaError } from "medusa-core-utils";
import { AdminPostAttributeReq } from "../api/attribute/create-attribute";
import ProductCategoryRepository from "../repositories/product-category";
import { AdminListAttributesParams } from "../api/attribute/list-attributes";

type InjectedDependencies = {
  manager: EntityManager;
  attributeRepository: typeof AttributeRepository;
  productCategoryRepository: typeof ProductCategoryRepository;
};

export const defaultAttributeRelations = ["values", "categories"];

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

    const categories = data?.categories?.map((c) => ({ id: c })) ?? [];

    const attribute = attributeRepo.create({
      ...data,
      categories,
    });

    const duplicate = await attributeRepo.findOne({
      where: { handle: attribute.handle },
    });

    if (duplicate) {
      throw new MedusaError(
        MedusaError.Types.CONFLICT,
        `"Attribute" with handle ${duplicate.handle} already exists`
      );
    }

    return await attributeRepo.save(attribute);
  }

  async list(
    { categories }: AdminListAttributesParams,
    defaultConfig: Pick<
      FindManyOptions<Attribute>,
      "select" | "where" | "relations"
    > = {}
  ) {
    const attributeRepo = this.activeManager_.withRepository(
      this.attributeRepository_
    );

    const where =
      (defaultConfig.where as Omit<
        FindManyOptions<Attribute>["where"],
        "values"
      >) || {};

    const config: FindManyOptions<Attribute> = {
      relations: defaultAttributeRelations,
      order: {
        values: {
          rank: "ASC",
        },
      },
      ...defaultConfig,
    };

    if (categories) {
      config.where = [
        {
          ...where,
          categories: {
            handle: In(categories),
          },
        },
        {
          ...where,
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

    const duplicate = await attributeRepo.findOne({
      where: { handle: createdAttribute.handle, id: Not(id) },
    });

    if (duplicate) {
      throw new MedusaError(
        MedusaError.Types.CONFLICT,
        `"Attribute" with handle ${duplicate.handle} already exists`
      );
    }

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
