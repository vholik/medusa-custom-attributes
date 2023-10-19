import { Entity, JoinTable, ManyToMany } from "typeorm";
import { ProductCategory as MedusaProductCategory } from "@medusajs/medusa";
import { Attribute } from "./attribute";

@Entity()
export class ProductCategory extends MedusaProductCategory {
  @ManyToMany(() => Attribute)
  @JoinTable()
  attributes: Attribute[];
}
