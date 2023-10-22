import { ProductCategory } from "@medusajs/medusa";
import { useQuery } from "@tanstack/react-query";
import { useMedusa } from "medusa-react";
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

export const useStoreAttributes = () => {
  const query = useQuery(["attributes"], async () => {
    const response: Attribute[] = await fetch(
      `${process.env.MEDUSA_BACKEND_URL}/store/attributes`,
      {
        credentials: "include",
      }
    ).then(async (res) => await res.json());

    return response;
  });

  return { ...query, attributes: query.data || [] };
};
