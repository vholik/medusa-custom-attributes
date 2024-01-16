import { WidgetConfig, ProductDetailsWidgetProps } from "@medusajs/admin";
import {
  Container,
  Text,
  Select,
  Label,
  Switch,
  Button,
  Input,
} from "@medusajs/ui";
import { XMarkMini } from "@medusajs/icons";
import { useAdminAttributes } from "../../util/use-admin-attributes";
import { Attribute } from "../../../models/attribute";
import NestedMultiselect from "../../util/multi-select";
import { useMemo } from "react";
import { useAdminUpdateProduct } from "medusa-react";
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import { AttributeValue } from "../../../models/attribute-value";
import { IntAttributeValue } from "../../../models/int-attribute-value";

const CustomAttributes = ({ notify, product }: ProductDetailsWidgetProps) => {
  const { attributes } = useAdminAttributes(
    // Category handles
    product?.categories?.map((category) => category.handle) ?? []
  );
  const { mutate, isLoading } = useAdminUpdateProduct(product.id, {
    onSuccess: () => {
      notify.success("Success", "Product updated successfully");
    },
  });

  // @ts-ignore
  const defaultAttributeValues: AttributeValue[] = product.attribute_values;
  const defaultIntAttributeValues: IntAttributeValue[] =
    // @ts-ignore
    product.int_attribute_values;

  const defaultIntValues = useMemo(() => {
    return defaultIntAttributeValues?.reduce((acc, cur) => {
      acc[cur.attribute.id] = cur.value;

      return acc;
    }, {});
  }, []);

  const defaultValues = useMemo(() => {
    const attributes = defaultAttributeValues?.reduce((acc, cur) => {
      if (!cur.attribute) return;
      if (cur.attribute.type === "multi") {
        const prevValues = acc[cur.attribute.id] || [];

        acc[cur.attribute.id] = [...prevValues, cur.id];
      } else if (cur.attribute.type === "boolean") {
        acc[cur.attribute.id] = true;
      } else {
        acc[cur.attribute.id] = cur.id;
      }

      return acc;
    }, {});

    return { ...attributes, ...defaultIntValues };
  }, []);

  const form = useForm<Record<string, any>>({
    defaultValues,
  });

  const onSubmit = (values) => {
    const int_attribute_values = Object.entries(values).reduce(
      (acc, [key, val]) => {
        if (typeof val === "number") {
          const attributeValueId = defaultIntAttributeValues.find(
            (it) => it.attribute.id === key
          )?.id;

          acc.push({
            id: attributeValueId,
            value: val,
            attribute_id: key,
          });
          delete values[key];
        }

        return acc;
      },
      []
    );
    const attribute_values = Object.entries(values).reduce(
      (acc, [key, val]) => {
        if (Array.isArray(val)) {
          val.forEach((v) => {
            acc.push({
              id: v,
            });
          });
        } else if (typeof val === "boolean") {
          if (val) {
            const findAttributeValue = attributes.find((it) => it.id === key);

            acc.push({
              id: findAttributeValue.values[0].id,
            });
          }
        } else {
          if (val) {
            acc.push({
              id: val,
            });
          }
        }
        return acc;
      },
      []
    );

    // @ts-ignore
    mutate({ attribute_values, int_attribute_values });
  };

  return (
    <Container className="p-8">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <h1 className="text-grey-90 inter-xlarge-semibold">
          Custom attributes
        </h1>
        <Text className="text-grey-50 mt-4">
          Improve user experience by adding custom attributes to your products.
        </Text>
        {attributes.length ? (
          <div>
            <div className="gap-y-6 mb-large mt-base flex flex-col">
              {attributes.map((attribute) => (
                <Controller
                  key={attribute.id}
                  name={attribute.id}
                  control={form.control}
                  render={({ field: { value, onChange } }) => {
                    return (
                      <AttributeInput
                        attribute={attribute}
                        handleChange={onChange}
                        value={value}
                      />
                    );
                  }}
                />
              ))}
            </div>
            <div className="flex justify-end">
              <Button disabled={isLoading} type="submit">
                Save
              </Button>
            </div>
          </div>
        ) : (
          <div className="min-h-[150px] flex items-center justify-center">
            <Text className="inter-small-regular text-grey-50 mt-4 text-center">
              Attributes with product categories not found. Add them in "Custom
              attributes"
            </Text>
          </div>
        )}
      </form>
    </Container>
  );
};

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
    value: String(value.id),
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
          onValueChange={(val) => handleChange(val)}
          value={value as string}
        >
          <div className="flex gap-2 items-center">
            <Select.Trigger>
              <Select.Value
                placeholder={`Select ${attribute.name.toLowerCase()}`}
              />
            </Select.Trigger>
            <XMarkMini
              className="text-grey-50 cursor-pointer"
              onClick={() => handleChange("")}
            />
          </div>

          <Select.Content>
            {attributeOptions.map((item) => (
              <Select.Item key={item.value} value={String(item.value)}>
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

  if (attribute.type === "range") {
    return (
      <div className="flex flex-col gap-y-2">
        <Label>{attribute.name}</Label>
        <Input
          type="number"
          placeholder="Enter value"
          value={(value as number) ?? ""}
          onChange={(e) => {
            const value = e.target.value.replace(/\./g, "");

            if (value === "") {
              handleChange(null);
            } else {
              handleChange(Number(value));
            }
          }}
        />
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

export const config: WidgetConfig = {
  zone: "product.details.after",
};

export default CustomAttributes;
