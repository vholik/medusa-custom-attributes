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

export const useAdminCreateAttribute = (
  options?: Omit<
    UseMutationOptions<unknown, unknown, Record<string, unknown>, unknown>,
    "mutationKey" | "mutationFn"
  >
) => {
  const mutation = useMutation(
    ["create-attribute"],
    async (body: Record<string, unknown>) => {
      const response = await $api.post(`/admin/attributes`, body);

      return response.data;
    },
    options
  );

  return mutation;
};
