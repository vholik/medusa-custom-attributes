import { Select, Label } from "@medusajs/ui";

const variants = [
  { label: "Multi", value: "multi" },
  { label: "Single", value: "single" },
  { label: "Boolean", value: "boolean" },
  { label: "Range", value: "range" },
];

export const AttributeTypeSelect = (props: Parameters<typeof Select>["0"]) => {
  return (
    <Select {...props}>
      <Select.Trigger>
        <Select.Value placeholder="Select attribute type" />
      </Select.Trigger>
      <Select.Content>
        {variants?.map((item) => (
          <Select.Item key={item.value} value={item.value}>
            {item.label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select>
  );
};
