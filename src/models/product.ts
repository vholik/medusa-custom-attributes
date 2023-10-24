import { Entity, JoinTable, ManyToMany } from "typeorm";
import { Product as MedusaProduct } from "@medusajs/medusa";
import { AttributeValue } from "./attribute-value";

@Entity()
export class Product extends MedusaProduct {
  @ManyToMany(() => AttributeValue)
  @JoinTable()
  attribute_values: AttributeValue[];
}
