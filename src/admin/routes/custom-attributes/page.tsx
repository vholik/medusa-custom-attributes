import { RouteConfig, RouteProps } from "@medusajs/admin";
import { Sparkles } from "@medusajs/icons";
import { useMemo } from "react";
import {
  Button,
  FocusModal,
  Text,
  Input,
  Label,
  Textarea,
  Checkbox,
} from "@medusajs/ui";
import { AttributeTypeSelect } from "./AttributeTypeSelect";
import { AttributeValues } from "./AttributeValues";
import { Controller } from "react-hook-form";
import { useAdminProductCategories } from "medusa-react";
import NestedMultiselect, {
  NestedMultiselectOption,
  transformCategoryToNestedFormOptions,
} from "./Multiselect";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Tag } from "@medusajs/icons";
import { Attribute, useStoreAttributes } from "./util/useStoreAttributes";
import { useAdminCreateAttribute } from "./util/useAdminCreateAttribute";
import { schema } from "./util/schema";

type NewAttributeForm = {
  name: string;
  handle?: string;
  description?: string;
  categories: string[];
  filterable?: boolean;
  type: string;
  values?: string[];
};

const AttributeRow = ({ attribute }: { attribute: Attribute }) => {
  return (
    <div className="flex w-full items-center justify-between h-[40px]">
      <div className="flex items-center">
        <Tag
          className="ml-[20px] flex w-[32px] items-center justify-center"
          color="rgba(156, 163, 175, 1)"
        />
        <p className="ml-2 select-none text-xs font-medium font-normal">
          {attribute.name}
        </p>
      </div>
    </div>
  );
};

const CustomAttributesPage = ({ notify }: RouteProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { attributes } = useStoreAttributes();

  return (
    <>
      <AttributeModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        notify={notify}
      />
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-8 px-xlarge py-large border-grey-20 border-b border-solid">
          <div className="flex items-start justify-between">
            <h1 className="inter-xlarge-semibold text-grey-90">
              Custom attributes
            </h1>
            <Button variant="secondary" onClick={() => setModalOpen(true)}>
              Add attribute
            </Button>
          </div>
          <p className="inter-small-regular text-grey-50 pt-1.5">
            Pomaga uporządkować produkty.
          </p>
        </div>
        <div className="pl-8 pr-8">
          {attributes.map((attribute) => (
            <AttributeRow attribute={attribute} />
          ))}
        </div>
      </div>
    </>
  );
};

export const AttributeModal = ({
  modalOpen,
  setModalOpen,
  notify,
}: {
  setModalOpen: (open: boolean) => void;
  modalOpen: boolean;
  notify: RouteProps["notify"];
}) => {
  const form = useForm<NewAttributeForm>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      values: [""],
    },
  });

  const { isLoading, mutate } = useAdminCreateAttribute(notify);

  const { product_categories: categories = [] } = useAdminProductCategories({
    parent_category_id: "null",
    include_descendants_tree: true,
  });

  const categoriesOptions: NestedMultiselectOption[] | undefined = useMemo(
    () => categories?.map(transformCategoryToNestedFormOptions),
    [categories]
  );

  const onSubmit = (data: NewAttributeForm) => {
    if (data.type === "boolean") {
      data.values = [];
    }

    mutate(data);
  };

  const showAttributeValues = form.watch("type") !== "boolean";

  return (
    <FocusModal open={modalOpen} onOpenChange={(open) => setModalOpen(open)}>
      <FocusModal.Content>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FocusModal.Header>
            <Button type="submit" isLoading={isLoading}>
              Save
            </Button>
          </FocusModal.Header>

          <FocusModal.Body
            className="flex flex-col items-center py-16 overflow-auto"
            style={{ height: "95vh" }}
          >
            <div className="max-w-lg w-full">
              <Text size="xlarge" family="sans">
                Create custom attribute
              </Text>
              <Text className="text-ui-fg-subtle mt-1">
                Custom attributes help users organize and filter products
              </Text>
              <div className="mt-8 flex flex-col gap-y-6">
                <div className="flex flex-col gap-y-2">
                  <Label>Name</Label>
                  <Input
                    placeholder="Custom attribute name"
                    name="name"
                    {...form.register("name")}
                  />
                  {form.formState.errors.name && (
                    <Text className="text-ui-fg-error">
                      {form.formState.errors.name.message}
                    </Text>
                  )}
                </div>
                <div className="flex flex-col gap-y-2">
                  <Label>Handle</Label>
                  <Input
                    placeholder="custom-attribute-handle"
                    {...form.register("handle")}
                  />
                  {form.formState.errors.handle && (
                    <Text className="text-ui-fg-error">
                      {form.formState.errors.handle.message}
                    </Text>
                  )}
                </div>
                <div className="flex flex-col gap-y-2">
                  <Label>Description</Label>
                  <Textarea
                    draggable={false}
                    {...form.register("description")}
                  />
                  {form.formState.errors.description && (
                    <Text className="text-ui-fg-error">
                      {form.formState.errors.description.message}
                    </Text>
                  )}
                </div>
                <div className="flex flex-col gap-y-2">
                  <Label>Categories</Label>
                  <Controller
                    name={"categories"}
                    control={form.control}
                    render={({ field: { value, onChange } }) => {
                      const initiallySelected = (value || []).reduce(
                        (acc, val) => {
                          acc[val] = true;
                          return acc;
                        },
                        {} as Record<string, true>
                      );

                      return (
                        <NestedMultiselect
                          placeholder={
                            !!categoriesOptions?.length
                              ? "Choose categories"
                              : "No categories available"
                          }
                          onSelect={onChange}
                          options={categoriesOptions}
                          initiallySelected={initiallySelected}
                        />
                      );
                    }}
                  />
                  {form.formState.errors.categories && (
                    <Text className="text-ui-fg-error">
                      {form.formState.errors.categories.message}
                    </Text>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Controller
                    name={"filterable"}
                    control={form.control}
                    render={({ field: { value, onChange } }) => (
                      <>
                        <Checkbox
                          id="filterable-attribute"
                          checked={value}
                          onClick={() => onChange(!value)}
                        />
                        <Label htmlFor="filterable-attribute">Filterable</Label>
                      </>
                    )}
                  />

                  {form.formState.errors.filterable && (
                    <Text className="text-ui-fg-error">
                      {form.formState.errors.filterable.message}
                    </Text>
                  )}
                </div>
                <div className="flex flex-col gap-y-2">
                  <Label>Type</Label>
                  <Controller
                    name={"type"}
                    control={form.control}
                    render={({ field: { value, onChange } }) => (
                      <AttributeTypeSelect
                        value={value}
                        onValueChange={onChange}
                      />
                    )}
                  />
                  {form.formState.errors.type && (
                    <Text className="text-ui-fg-error">
                      {form.formState.errors.type.message}
                    </Text>
                  )}
                </div>
                {showAttributeValues && (
                  <div className="flex flex-col gap-y-2">
                    <Controller
                      name={"values"}
                      control={form.control}
                      render={({ field: { value, onChange, ref } }) => (
                        <AttributeValues
                          setValues={onChange}
                          values={value}
                          ref={ref}
                          errors={
                            form.formState.errors.values as {
                              message: string;
                            }[]
                          }
                        />
                      )}
                    />
                    {form.formState.errors.values?.message && (
                      <Text className="text-ui-fg-error">
                        {form.formState.errors.values.message}
                      </Text>
                    )}
                  </div>
                )}
              </div>
            </div>
          </FocusModal.Body>
        </form>
      </FocusModal.Content>
    </FocusModal>
  );
};

export const config: RouteConfig = {
  link: {
    label: "Custom attributes",
    icon: Sparkles,
  },
};

export default CustomAttributesPage;
