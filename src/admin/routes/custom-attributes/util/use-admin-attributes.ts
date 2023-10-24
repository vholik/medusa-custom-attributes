import { ProductCategory } from "@medusajs/medusa";
import { useQuery } from "@tanstack/react-query";
import { $api } from "./api";
import { AttributeType } from "../../../../models/attribute";

export type Attribute = {
  id: string;
  name: string;
  description: string;
  type: AttributeType;
  values: { value: string }[];
  handle: string;
  filterable: boolean;
  metadata: Record<string, unknown>;
  categories: ProductCategory[];
};

export const useAdminAttributes = () => {
  const query = useQuery(["attributes"], async () => {
    const response = await $api.get(`/admin/attributes`);

    return response.data;
  });

  return { ...query, attributes: query.data || [] };
};
