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

  @Column({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>;

  @Column({ type: "boolean", default: false })
  is_bool: boolean;

  @Column({ type: "int" })
  rank: number;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "attr_val");
  }
}
