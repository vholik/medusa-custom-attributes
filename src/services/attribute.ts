import { TransactionBaseService } from "@medusajs/medusa";
import { AdminCreateAttributeReq } from "src/api/admin/attribute/create-attribute";
import { Attribute } from "src/models/attribute";
import { AttributeRepository } from "src/repositories/attribute";
import { EntityManager, FindOneOptions, ILike, In } from "typeorm";
import { MedusaError } from "medusa-core-utils";

type InjectedDependencies = {
  manager: EntityManager;
  attributeRepository: typeof AttributeRepository;
};

type ListAndQueryConfig = {
  attributes: { handle: string; value: string[] | string | boolean }[];
};

export const defaultAttributeRelations = [];

class AttributeService extends TransactionBaseService {
  protected readonly attributeRepository_: typeof AttributeRepository;

  constructor({ attributeRepository }: InjectedDependencies) {
    super(arguments[0]);
    this.attributeRepository_ = attributeRepository;
  }

  async create(data: AdminCreateAttributeReq) {
    const attributeRepo = this.activeManager_.withRepository(
      this.attributeRepository_
    );

    const attribute = attributeRepo.create(data);

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
