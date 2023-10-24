import { ProductCategory } from "@medusajs/medusa";
import { useMutation } from "@tanstack/react-query";
import { useStoreAttributes } from "./use-store-attributes";
import { RouteProps } from "@medusajs/admin-ui";
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
  max_value_quantity: number;
};

export const useAdminDeleteAttribute = (notify: RouteProps["notify"]) => {
  const { refetch } = useStoreAttributes();

  const mutation = useMutation(
    ["delete-attribute"],
    async (id: string) => {
      const response = await $api.delete(`/admin/attributes/${id}`);

      return response.data;
    },
    {
      onSuccess: () => {
        refetch();
        notify.success("Success", "Successfully deleted attribute");
      },
      onError: () => {
        notify.error("Error", "Failed to delete attribute");
      },
    }
  );

  return mutation;
};
