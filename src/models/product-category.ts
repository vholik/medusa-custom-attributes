import {
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  Tree,
  TreeChildren,
  TreeParent,
} from "typeorm";
import { ProductCategory as MedusaProductCategory } from "@medusajs/medusa";
import { Attribute } from "./attribute";
import { Product } from "./product";

@Entity()
@Tree("materialized-path")
export class ProductCategory extends MedusaProductCategory {
  @ManyToMany(() => Attribute)
  @JoinTable()
  attributes: Attribute[];

  @TreeParent()
  @JoinColumn({ name: "parent_category_id" })
  // @ts-ignore
  parent_category: ProductCategory | null;

  @TreeChildren({ cascade: true })
  // @ts-ignore
  category_children: ProductCategory[];

  @ManyToMany(() => Product, { cascade: ["remove", "soft-remove"] })
  @JoinTable({
    name: ProductCategory.productCategoryProductJoinTable,
    joinColumn: {
      name: "product_category_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "product_id",
      referencedColumnName: "id",
    },
  })
  products: Product[];
}
