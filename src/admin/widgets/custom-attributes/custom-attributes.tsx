import { WidgetConfig, ProductDetailsWidgetProps } from "@medusajs/admin";
import { Container, Text, Select, Label, Switch, Button } from "@medusajs/ui";
import { useStoreCategoryAttributes } from "./util/use-store-category-attributes";
import { Attribute } from "src/models/attribute";
import NestedMultiselect from "./util/multi-select";
import { useState, useEffect, useMemo } from "react";
import { isEqual } from "lodash";

const AttributeInput = ({
  attribute,
  handleChange,
  value,
}: {
  attribute: Attribute;
  value: unknown;
  handleChange: (val: unknown) => void;
}) => {
  const attributeOptions = attribute.values.map((value) => ({
    value: value.value,
    label: value.value,
  }));

  const initial = useMemo(() => {
    if (attribute.type === "multi") {
      return (value as string[])?.reduce((acc, cur) => {
        acc[cur] = true;

        return acc;
      }, {});
    }

    return value;
  }, []);

  if (attribute.type === "multi") {
    return (
      <div className="flex flex-col gap-y-2">
        <Label>{attribute.name}</Label>
        <NestedMultiselect
          initiallySelected={initial as Record<string, true>}
          options={attributeOptions}
          placeholder={`Select ${attribute.name.toLowerCase()}`}
          onSelect={(value) => handleChange(value)}
        />
        {attribute.description && (
          <Text className="inter-small-regular text-grey-50">
            {attribute.description}
          </Text>
        )}
      </div>
    );
  }

  if (attribute.type === "single") {
    return (
      <div className="flex flex-col gap-y-2">
        <Label>{attribute.name}</Label>
        <Select
          defaultValue={value as string}
          onValueChange={(val) => handleChange(val)}
        >
          <Select.Trigger>
            <Select.Value
              placeholder={`Select ${attribute.name.toLowerCase()}`}
            />
          </Select.Trigger>
          <Select.Content>
            {attributeOptions.map((item) => (
              <Select.Item key={item.value} value={item.value}>
                {item.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
        {attribute.description && (
          <Text className="inter-small-regular text-grey-50">
            {attribute.description}
          </Text>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center space-x-2">
        <Switch
          checked={value as boolean}
          onClick={() => handleChange(!value)}
        />
        <Label>{attribute.name}</Label>
      </div>

      {attribute.description && (
        <Text className="inter-small-regular text-grey-50">
          {attribute.description}
        </Text>
      )}
    </div>
  );
};

const CustomAttributes = ({ notify, product }: ProductDetailsWidgetProps) => {
  const { attributes } = useStoreCategoryAttributes(
    // Category handles
    product.categories.map((category) => category.handle)
  );
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [defaultValues, setDefaultValues] = useState<Record<string, unknown>>(
    {}
  );
  const handleAttributeChange = (id: string) => (value: unknown) => {
    setValues((prev) => ({ ...prev, [id]: value }));
  };

  const isDirty = useMemo(() => {
    return isEqual(values, defaultValues);
  }, [values]);

  useEffect(() => {
    const values = {};

    attributes.forEach((attribute) => {
      if (attribute.type === "multi") {
        values[attribute.id] = [];
        return;
      }

      if (attribute.type === "boolean") {
        values[attribute.id] = false;
        return;
      }

      if (attribute.type === "single") {
        values[attribute.id] = "";
        return;
      }
    });

    setDefaultValues(values);
    setValues(values);
  }, [attributes]);

  return (
    <Container className="p-8">
      <h1 className="text-grey-90 inter-xlarge-semibold">
        Product custom attributes
      </h1>
      <Text className="text-grey-50 mt-4">
        Improve user experience by adding custom attributes to your products.
      </Text>
      <div className="gap-y-6 mb-large mt-base flex flex-col">
        {attributes.map((attribute) => (
          <AttributeInput
            attribute={attribute}
            value={values[attribute.id]}
            handleChange={handleAttributeChange(attribute.id)}
          />
        ))}
      </div>
      <div className="flex justify-end">
        <Button disabled={isDirty}>Save</Button>
      </div>
    </Container>
  );
};

export const config: WidgetConfig = {
  zone: "product.details.after",
};

export default CustomAttributes;
