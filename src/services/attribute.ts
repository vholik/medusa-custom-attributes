import { TransactionBaseService } from "@medusajs/medusa";
import { AdminCreateAttributeReq } from "src/api/admin/attribute/create-attribute";
import { Attribute } from "src/models/attribute";
import { AttributeRepository } from "src/repositories/attribute";
import { EntityManager, FindOneOptions, ILike } from "typeorm";
import { MedusaError } from "medusa-core-utils";

type InjectedDependencies = {
  manager: EntityManager;
  attributeRepository: typeof AttributeRepository;
};

export const defaultAttributeRelations = ["categories"];

class AttributeService extends TransactionBaseService {
  protected readonly attributeRepository_: typeof AttributeRepository;

  constructor({ attributeRepository }: InjectedDependencies) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0]);
    this.attributeRepository_ = attributeRepository;
  }

  async create(data: AdminCreateAttributeReq) {
    const attribute = this.attributeRepository_.create(data);

    return await this.attributeRepository_.save(attribute);
  }

  async listAndCount(
    config: { offset?: number; limit?: number; q?: string } = {
      offset: 0,
      limit: 15,
    }
  ) {
    const { limit, offset, q } = config;

    const [attributes, count] = await this.attributeRepository_.findAndCount({
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
    const attribute = await this.attributeRepository_.findOne({
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

    return await this.attributeRepository_.save(attribute);
  }

  async delete(id: string) {
    try {
      return await this.attributeRepository_.delete(id);
    } catch (error) {
      throw new MedusaError(
        MedusaError.Types.DB_ERROR,
        `Failed to delete attribute with id: ${id}`
      );
    }
  }
}

export default AttributeService;
