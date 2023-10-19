import { BeforeInsert, Column, Entity, JoinTable, ManyToMany } from "typeorm";
import { ProductCategory } from "./product-category";
import { Product } from "./product";
import { generateEntityId } from "@medusajs/medusa";
import { BaseEntity } from "@medusajs/medusa";

export enum AttributeType {
  MULTI = "multi",
  SINGLE = "single",
  BOOLEAN = "boolean",
  CUSTOM = "custom",
}

@Entity()
export class Attribute extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: "enum", enum: AttributeType })
  type: AttributeType;

  @Column()
  value: string;

  @Column({ unique: true })
  handle: string;

  @Column({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>;

  @ManyToMany(() => Product)
  @JoinTable()
  products: Product[];

  @ManyToMany(() => ProductCategory)
  @JoinTable()
  categories: ProductCategory[];

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "attr");
  }
}
