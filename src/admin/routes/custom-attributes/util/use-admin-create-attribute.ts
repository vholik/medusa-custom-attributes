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

export const useAdminCreateAttribute = (
  notify: RouteProps["notify"],
  setModalOpen: (value: boolean) => void
) => {
  const { refetch } = useAdminAttributes();

  const mutation = useMutation(
    ["create-attribute"],
    async (body: Record<string, unknown>) => {
      const response = await $api.post(`/admin/attributes`, body);

      return response.data;
    },
    {
      onSuccess: () => {
        refetch();
        setModalOpen(false);
        notify.success("Success", "Successfully created attribute");
      },
      onError: () => {
        notify.error("Error", "Failed to create attribute");
      },
    }
  );

  return mutation;
};
