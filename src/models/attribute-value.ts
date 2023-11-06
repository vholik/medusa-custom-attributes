import {
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from "typeorm";
import { generateEntityId } from "@medusajs/medusa";
import { BaseEntity } from "@medusajs/medusa";
import { Attribute } from "./attribute";
import { Product } from "./product";

@Entity()
export class AttributeValue extends BaseEntity {
  @Column({ nullable: true })
  value: string;

  @ManyToOne(() => Attribute, (a) => a.values)
  attribute: Attribute;

  @Column({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>;

  @Column({ type: "int" })
  rank: number;

  @ManyToMany(() => Product)
  @JoinTable()
  products: Product[];

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "attr_val");
  }
}
