import { ProductCategory } from "@medusajs/medusa";
import { useMutation } from "@tanstack/react-query";
import { useAdminAttributes } from "./use-admin-attributes";
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
};

export const useAdminUpdateAttribute = (
  notify: RouteProps["notify"],
  setModalOpen: (value: boolean) => void,
  id: string
) => {
  const { refetch } = useAdminAttributes();

  const mutation = useMutation(
    ["update-attribute"],
    async (body: Record<string, unknown>) => {
      const response = await $api.post(
        `${process.env.MEDUSA_BACKEND_URL}/admin/attributes/${id}`,
        body
      );

      return response.data;
    },
    {
      onSuccess: () => {
        refetch();
        setModalOpen(false);
        notify.success("Success", "Successfully updated attribute");
      },
      onError: () => {
        notify.error("Error", "Failed to update attribute");
      },
    }
  );

  return mutation;
};
