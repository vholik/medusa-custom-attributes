import { BeforeInsert, Column, Entity, ManyToOne } from "typeorm";
import { generateEntityId } from "@medusajs/medusa";
import { BaseEntity } from "@medusajs/medusa";
import { Attribute } from "./attribute";

@Entity()
export class AttributeValue extends BaseEntity {
  @Column()
  value: string;

  @ManyToOne(() => Attribute, (a) => a.values)
  attribute: Attribute;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "attr");
  }
}
