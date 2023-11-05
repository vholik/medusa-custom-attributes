import * as yup from "yup";

export const schema = yup.object().shape({
  name: yup.string().required("Enter attribute name"),
  handle: yup
    .string()
    .test("kebab-case", "Handle must be in kebab-case format", (value) => {
      if (!value) return true;

      const pattern =
        /^([a-z](?![\d])|[\d](?![a-z]))+(-?([a-z](?![\d])|[\d](?![a-z])))*$|^$/;

      return pattern.test(value) && !value.includes("_");
    }),
  description: yup.string().nullable(),
  categories: yup.array().of(yup.string()),
  filterable: yup.boolean().nullable(),
  type: yup.string().required("Choose attribute type"),
  values: yup.array().when("type", {
    is: (type) => type === "range" || type === "boolean",
    then: () =>
      yup.array().of(
        yup.object().shape({
          value: yup.string().nullable(),
        })
      ),
    otherwise: () =>
      yup.array().of(
        yup.object().shape({
          value: yup.string().required("Value is required"),
        })
      ),
  }),
});
