import { Entity, JoinTable, ManyToMany } from "typeorm";
import { Product as MedusaProduct } from "@medusajs/medusa";
import { Attribute } from "./attribute";

@Entity()
export class Product extends MedusaProduct {
  @ManyToMany(() => Attribute)
  @JoinTable()
  attributes: Attribute[];
}
