import { Input, Label, Text } from "@medusajs/ui";
import { PlusMini, XMarkMini } from "@medusajs/icons";

export const AttributeValues = ({
  setValues,
  values,
  errors,
}: {
  values: string[];
  setValues: (values: string[]) => void;
  ref: any;
  errors: { message: string }[];
}) => {
  const addValue = () => {
    setValues([...values, ""]);
  };

  const onChange =
    (key: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValues = [...values];
      newValues[key] = e.target.value;
      setValues(newValues);
    };

  const deleteRow = (key: number) => () => {
    if (values.length === 1) {
      return;
    }

    const newValues = [...values];
    newValues.splice(key, 1);
    setValues(newValues);
  };

  if (!values) {
    return null;
  }

  return (
    <div className="flex flex-col gap-y-2">
      <Label>Value</Label>
      <div className="flex flex-col gap-y-4">
        {values.map((val, key) => (
          <div className="flex flex-col gap-y-2">
            <div className="flex gap-2 items-center" key={key}>
              <div className="w-full">
                <Input
                  placeholder="Enter the value"
                  onChange={onChange(key)}
                  value={val}
                />
              </div>
              <XMarkMini
                className="cursor-pointer"
                color="rgba(3, 7, 18, 0.4)"
                onClick={deleteRow(key)}
              />
            </div>
            {errors?.[key] && (
              <Text className="text-ui-fg-error">Enter the value</Text>
            )}
          </div>
        ))}
      </div>
      <div
        className="flex items-center gap-2 mt-4 cursor-pointer"
        onClick={addValue}
      >
        <PlusMini color="rgb(59, 130, 246)" />
        <Label className="text-ui-bg-interactive cursor-pointer">Add</Label>
      </div>
    </div>
  );
};
