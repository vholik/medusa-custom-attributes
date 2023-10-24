import { RouteConfig, RouteProps } from "@medusajs/admin";
import {
  Sparkles,
  EllipsisHorizontal,
  PencilSquare,
  Trash,
  Minus,
  Plus,
} from "@medusajs/icons";
import { useMemo } from "react";
import {
  Button,
  FocusModal,
  Text,
  Input,
  Label,
  Textarea,
  Switch,
  DropdownMenu,
  IconButton,
  usePrompt,
} from "@medusajs/ui";
import { AttributeTypeSelect } from "./attribute-type-select";
import { AttributeValues } from "./attribute-values";
import { Controller } from "react-hook-form";
import { useAdminProductCategories } from "medusa-react";
import NestedMultiselect, {
  NestedMultiselectOption,
  transformCategoryToNestedFormOptions,
} from "./multi-select";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Tag } from "@medusajs/icons";
import { Dispatch, SetStateAction } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  Attribute,
  useAdminDeleteAttribute,
} from "./util/use-admin-delete-attribute";
import { useStoreAttributes } from "./util/use-store-attributes";
import { useAdminCreateAttribute } from "./util/use-admin-create-attribute";
import { useAdminUpdateAttribute } from "./util/use-admin-update-atttribute";
import { schema } from "./util/schema";

type NewAttributeForm = {
  name: string;
  handle?: string;
  description?: string;
  categories: string[];
  filterable?: boolean;
  type: string;
  values?: { value: string; id?: string; metadata?: Record<string, unknown> }[];
  max_value_quantity: number;
};

type AttributeRowProps = {
  attribute: Attribute;
  notify: RouteProps["notify"];
  setEditModalOpen: Dispatch<SetStateAction<boolean>>;
  setCurrentAttribute: Dispatch<SetStateAction<Attribute>>;
};

const AttributeDropdown = (props: AttributeRowProps) => {
  const {
    attribute: { id },
    notify,
    setEditModalOpen,
    setCurrentAttribute,
  } = props;

  const dialog = usePrompt();
  const { mutate } = useAdminDeleteAttribute(notify);

  const actionFunction = async () => {
    const confirmed = await dialog({
      title: "Are you sure?",
      description: "Please confirm this action",
    });

    if (confirmed) {
      mutate(id);
    }
  };

  const onEditClick = () => {
    setEditModalOpen(true);
    setCurrentAttribute(props.attribute);
  };

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <IconButton>
          <EllipsisHorizontal />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content side="bottom" align="end">
        <DropdownMenu.Item className="gap-x-2" onClick={onEditClick}>
          <PencilSquare className="text-ui-fg-subtle" />
          Edit
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item className="gap-x-2" onClick={actionFunction}>
          <Trash className="text-ui-fg-subtle" />
          Delete
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};

const AttributeRow = (props: AttributeRowProps) => {
  const { attribute } = props;

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
      <AttributeDropdown {...props} />
    </div>
  );
};

const CustomAttributesPage = ({ notify }: RouteProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const { attributes } = useStoreAttributes();
  const [currentAttribute, setCurrentAttribute] = useState<Attribute | null>(
    null
  );

  const { isLoading, mutate } = useAdminCreateAttribute(notify, setModalOpen);

  const { isLoading: updateIsLoading, mutate: update } =
    useAdminUpdateAttribute(notify, setEditModalOpen, currentAttribute?.id);

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        {setEditModalOpen && (
          <AttributeModal
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            notify={notify}
            title="Create new attribute"
            description="Attributes are used to describe products. They can be used to filter products in the storefront."
            onSubmit={(data) => mutate(data)}
            isLoading={isLoading}
            defaultValues={{
              values: [{ value: "" }],
              max_value_quantity: 1,
            }}
          />
        )}
        {editModalOpen && (
          <AttributeModal
            modalOpen={editModalOpen}
            setModalOpen={setEditModalOpen}
            notify={notify}
            title="Update attribute"
            description="Attributes are used to describe products. They can be used to filter products in the storefront."
            onSubmit={(data) => update(data)}
            isLoading={updateIsLoading}
            defaultValues={{
              name: currentAttribute?.name,
              description: currentAttribute?.description,
              handle: currentAttribute?.handle,
              categories: currentAttribute?.categories.map((c) => c.id),
              filterable: currentAttribute?.filterable,
              type: currentAttribute?.type,
              max_value_quantity: currentAttribute?.max_value_quantity,
              values: currentAttribute.values.length
                ? currentAttribute.values
                : [{ value: "" }],
            }}
          />
        )}
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
              Helps oranize products
            </p>
          </div>
          {attributes.length === 0 ? (
            <div className="pl-8 pr-8 pt-2 pb-2 min-h-[350px] flex items-center justify-center">
              <p className="inter-small-regular text-grey-50 pt-1.5">
                No attributes found. Start adding them by "Add attribute" button
              </p>
            </div>
          ) : (
            <div className="pl-8 pr-8 pt-2 pb-2 min-h-[350px]">
              {attributes.map((attribute) => (
                <AttributeRow
                  attribute={attribute}
                  notify={notify}
                  setEditModalOpen={setEditModalOpen}
                  setCurrentAttribute={setCurrentAttribute}
                />
              ))}
            </div>
          )}
        </div>
      </DndProvider>
    </>
  );
};

export const AttributeModal = ({
  modalOpen,
  setModalOpen,
  notify,
  description,
  title,
  defaultValues,
  onSubmit: onSubmitFunction,
  isLoading,
}: {
  setModalOpen: (open: boolean) => void;
  modalOpen: boolean;
  notify: RouteProps["notify"];
  title: string;
  description: string;
  defaultValues?: Partial<NewAttributeForm>;
  onSubmit: (data: NewAttributeForm) => void;
  isLoading?: boolean;
}) => {
  const form = useForm<NewAttributeForm>({
    resolver: yupResolver(schema) as any,
    defaultValues,
  });

  console.log(form.formState.errors);

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

    if (data.type !== "multi") {
      data.max_value_quantity = 1;
    }

    data.values = data.values.map((attrValue, rank) => ({
      value: attrValue.value,
      id: attrValue?.id,
      metadata: attrValue?.metadata,
      rank,
    }));

    onSubmitFunction(data);
  };

  const showAttributeValues = form.watch("type") !== "boolean";
  const showMaxValuesQuantity = form.watch("type") === "multi";

  return (
    <FocusModal open={modalOpen} onOpenChange={(open) => setModalOpen(open)}>
      <FocusModal.Content>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FocusModal.Header>
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={!form.formState.isDirty}
            >
              Save
            </Button>
          </FocusModal.Header>

          <FocusModal.Body
            className="flex flex-col items-center py-16 overflow-auto"
            style={{ height: "95vh" }}
          >
            <div className="max-w-lg w-full">
              <Text size="xlarge" family="sans">
                {title}
              </Text>
              <Text className="text-ui-fg-subtle mt-1">{description}</Text>
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
                    placeholder="Unique identifier for the attribute. Example: custom-attribute-1"
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
                    spellCheck={false}
                    draggable={false}
                    placeholder="Description will be shown under the attribute input"
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
                        <Switch
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
                {showMaxValuesQuantity && (
                  <div className="flex flex-col gap-y-2">
                    <Label>Max values quantity</Label>
                    <Controller
                      name={"max_value_quantity"}
                      control={form.control}
                      render={({ field: { value, onChange } }) => (
                        <div className="flex gap-4 items-center">
                          <IconButton
                            type="button"
                            onClick={() => {
                              if (value > 1) {
                                onChange(value - 1);
                              }
                            }}
                          >
                            <Minus />
                          </IconButton>
                          <Text>{value}</Text>
                          <IconButton
                            type="button"
                            onClick={() => {
                              if (value < 10) {
                                onChange(value + 1);
                              }
                            }}
                          >
                            <Plus />
                          </IconButton>
                        </div>
                      )}
                    />
                    {form.formState.errors.max_value_quantity && (
                      <Text className="text-ui-fg-error">
                        {form.formState.errors.max_value_quantity.message}
                      </Text>
                    )}
                  </div>
                )}
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
