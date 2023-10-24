import { useQuery } from "@tanstack/react-query";
import { $api } from "./api";
import { Attribute } from "src/models/attribute";

// Duplicating this snippet due to a bug in the parser
export const useAdminCategoryAttributes = (categories: string[]) => {
  const query = useQuery<Attribute[]>(["attributes", categories], async () => {
    const response = await $api.get(`/admin/attributes`, {
      params: {
        categories,
      },
    });

    return response.data;
  });

  return { ...query, attributes: query.data || [] };
};
