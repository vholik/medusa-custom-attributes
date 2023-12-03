import { ProductCategory } from "@medusajs/medusa";
import { UseMutationOptions, useMutation } from "@tanstack/react-query";
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

export const useAdminUpdateAttribute = (
  id: string,
  options?: Omit<
    UseMutationOptions<any, unknown, Record<string, unknown>, unknown>,
    "mutationFn" | "mutationKey"
  >
) => {
  const mutation = useMutation(
    ["update-attribute"],
    async (body: Record<string, unknown>) => {
      const response = await $api.post(`/admin/attributes/${id}`, body);

      return response.data;
    },
    options
  );

  return mutation;
};
