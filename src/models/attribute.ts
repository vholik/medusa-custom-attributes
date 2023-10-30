import {
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
} from "typeorm";
import { ProductCategory } from "./product-category";
import { Product } from "./product";
import { generateEntityId } from "@medusajs/medusa";
import { BaseEntity } from "@medusajs/medusa";
import { AttributeValue } from "./attribute-value";
import { kebabCase } from "lodash";

export enum AttributeType {
  MULTI = "multi",
  SINGLE = "single",
  BOOLEAN = "boolean",
}

@Entity()
export class Attribute extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: "enum", enum: AttributeType })
  type: AttributeType;

  @OneToMany(() => AttributeValue, (v) => v.attribute, {
    cascade: true,
    onDelete: "CASCADE",
  })
  values: AttributeValue[];

  @Column({ unique: true })
  handle: string;

  @Column({ type: "boolean", default: false })
  filterable: boolean;

  @Column({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>;

  @ManyToMany(() => ProductCategory)
  @JoinTable()
  categories: ProductCategory[];

  @Column({ default: 1, type: "int" })
  max_value_quantity: number;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "attr");

    if (!this.handle) {
      this.handle = kebabCase(this.name);
    }
  }
}
