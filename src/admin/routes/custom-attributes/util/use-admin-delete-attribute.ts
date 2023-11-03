import { ProductCategory } from "@medusajs/medusa";
import { useMutation } from "@tanstack/react-query";
import { RouteProps } from "@medusajs/admin-ui";
import { AttributeType } from "../../../../models/attribute";
import { $api } from "../../../util/api";
import { useAdminAttributes } from "../../../util/use-admin-attributes";

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

export const useAdminDeleteAttribute = (notify: RouteProps["notify"]) => {
  const { refetch } = useAdminAttributes();

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
