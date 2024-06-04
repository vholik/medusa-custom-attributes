import { useQuery } from "@tanstack/react-query";
import { $api } from "./api";
import { Attribute } from "../../models/attribute";

export const useAdminAttributes = (categories?: string[]) => {
  const query = useQuery<{ attributes: Attribute[] }>(
    ["attributes", categories],
    async () => {
      const response = await $api.get(`/admin/attributes`, {
        params: {
          categories,
        },
      });

      return response.data;
    }
  );

  return { ...query, attributes: query.data?.attributes || [] };
};
