import { ProductCategory } from "@medusajs/medusa";
import { useMutation } from "@tanstack/react-query";
import { AttributeType } from "../../../../models/attribute";
import { useStoreAttributes } from "./useStoreAttributes";
import { RouteProps } from "@medusajs/admin-ui";

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

export const useAdminCreateAttribute = (notify: RouteProps["notify"]) => {
  const { refetch } = useStoreAttributes();

  const query = useMutation(
    ["create-attribute"],
    async (body: Record<string, unknown>) => {
      const response: Attribute[] = await fetch(
        `${process.env.MEDUSA_BACKEND_URL}/admin/attributes`,
        {
          credentials: "include",
          method: "POST",
          body: JSON.stringify(body),
        }
      ).then(async (res) => await res.json());

      return response;
    },
    {
      onSuccess: () => {
        refetch();
      },
      onError: (error) => {
        notify.error("Error", "Failed to create attribute");
      },
    }
  );

  return { ...query, attributes: query.data || [] };
};
