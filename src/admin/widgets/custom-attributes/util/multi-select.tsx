import clsx from "clsx";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { sum } from "lodash";
import { Check as CheckIcon } from "@medusajs/icons";
import { ChevronDownMini as ChevronDownIcon } from "@medusajs/icons";
import { ChevronRightMini as ChevronRightIcon } from "@medusajs/icons";
import { XMarkMini as CrossIcon } from "@medusajs/icons";
import { ArrowUturnLeft as UTurnIcon } from "@medusajs/icons";
import { useToggleState } from "@medusajs/ui";
import { Tooltip } from "@medusajs/ui";
import { ProductCategory } from "@medusajs/medusa";

const useOutsideClick = (callback: () => void, ref: any, capture = false) => {
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!ref.current.contains(e.target)) {
        callback();
      }
    };

    document.addEventListener("click", handleClickOutside, capture);

    return () => {
      document.removeEventListener("click", handleClickOutside, capture);
    };
  }, [callback, ref, capture]);
};

/**
 * Types
 */
export type NestedMultiselectOption = {
  value: string;
  label: string;
  children?: NestedMultiselectOption[];
};

export function transformCategoryToNestedFormOptions(
  category: ProductCategory
): NestedMultiselectOption {
  const children =
    category.category_children?.map(transformCategoryToNestedFormOptions) || [];

  return { value: category.id, label: category.name, children };
}

/**
 * Selected categories count tooltip
 */
const ToolTipContent = (props: { list: string[] }) => {
  return (
    <div className="flex flex-col">
      {props.list.map((listItem) => (
        <span key={listItem}>{listItem}</span>
      ))}
    </div>
  );
};

type InputProps = {
  placeholder?: string;
  disabled?: boolean;
  isOpen: boolean;
  selected: Record<string, true>;
  options: NestedMultiselectOption[];
  openPopup: () => void;
  resetSelected: () => void;
};

/**
 * Multiselect input area
 */
function Input(props: InputProps) {
  const {
    placeholder,
    isOpen,
    selected,
    openPopup,
    resetSelected,
    options,
    disabled,
  } = props;
  const selectedCount = Object.keys(selected).length;
  const { t } = useTranslation();

  const selectedOption = useMemo(() => {
    const ret: string[] = [];

    const visit = (option: NestedMultiselectOption) => {
      if (selected[option.value]) {
        ret.push(option.label);
      }
      option.children?.forEach(visit);
    };

    options.forEach(visit);
    return ret;
  }, [selected, options]);

  return (
    <div
      onClick={openPopup}
      className={clsx(
        "rounded-rounded border-grey-20 bg-grey-5 px-small focus-within:border-violet-60 focus-within:shadow-cta flex h-10 items-center justify-between border text-sm",
        { "opacity-50": disabled },
        { "pointer-events-none": disabled }
      )}
    >
      <div className="flex items-center gap-1">
        {!!selectedCount && (
          <Tooltip
            side="top"
            delayDuration={1500}
            content={<ToolTipContent list={selectedOption} />}
          >
            <span className="rounded-rounded bg-grey-10 flex h-[28px] items-center gap-2 border px-2 font-medium text-gray-500">
              {selectedCount}
              <CrossIcon className="cursor-pointer" onClick={resetSelected} />
            </span>
          </Tooltip>
        )}
        {selectedCount === 0 ? (
          <span className="text-grey-50">
            {placeholder
              ? placeholder
              : t("multiselect-choose-categories", "Choose categories")}
          </span>
        ) : null}
      </div>
      <ChevronDownIcon
        style={{
          transition: ".2s transform",
          transform: `rotate(${isOpen ? 180 : 0}deg)`,
        }}
      />
    </div>
  );
}

type CheckboxProps = { isSelected: boolean };

/**
 * List item checkbox
 */
const Checkbox = ({ isSelected }: CheckboxProps) => {
  return (
    <div
      className={clsx(
        `rounded-base border-grey-30 text-grey-0 flex h-5 w-5 justify-center border`,
        {
          "bg-violet-60": isSelected,
        }
      )}
    >
      <span className="self-center">{isSelected && <CheckIcon />}</span>
    </div>
  );
};

type PopupItemProps = {
  isSelected: boolean;
  option: NestedMultiselectOption;
  selectedSubcategoriesCount: number;
  onOptionClick: (option: NestedMultiselectOption) => void;
  onOptionCheckboxClick: (option: NestedMultiselectOption) => void;
  disabled?: boolean;
};

/**
 * Popup list item
 */
function PopupItem(props: PopupItemProps) {
  const {
    option,
    isSelected,
    onOptionClick,
    onOptionCheckboxClick,
    selectedSubcategoriesCount,
    disabled,
  } = props;

  const { t } = useTranslation();
  const hasChildren = !!option.children?.length;

  const onClick = (e) => {
    e.stopPropagation();
    if (hasChildren) {
      onOptionClick(option);
    }
  };

  return (
    <div
      onClick={onClick}
      className={clsx("flex h-[40px] items-center justify-between gap-2 px-3", {
        "hover:bg-grey-10 cursor-pointer": hasChildren,
        "text-gray-400": disabled,
      })}
    >
      <div className="flex items-center gap-2">
        <div
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onOptionCheckboxClick(option);
          }}
        >
          <Checkbox isSelected={isSelected} />
        </div>
        {option.label}
      </div>

      {hasChildren && (
        <div className="flex items-center gap-2">
          {!!selectedSubcategoriesCount && (
            <span className="text-small text-gray-400">
              {t(
                "domain-categories-multiselect-selected-with-counts",
                "{{count}}",
                { count: selectedSubcategoriesCount }
              )}
            </span>
          )}
          <ChevronRightIcon />
        </div>
      )}
    </div>
  );
}

type PopupProps = {
  pop: () => void;
  selected: Record<string, true>;
  activeOption: NestedMultiselectOption;
  selectedSubcategoriesCount: Record<string, number>;
  onOptionClick: (option: NestedMultiselectOption) => void;
  onOptionCheckboxClick: (option: NestedMultiselectOption) => void;
  disabled?: boolean;
};

/**
 * Popup menu
 */
function Popup(props: PopupProps) {
  const {
    activeOption,
    onOptionClick,
    onOptionCheckboxClick,
    pop,
    selected,
    selectedSubcategoriesCount,
    disabled,
  } = props;

  const showBack = !!activeOption.value;

  return (
    <div
      style={{
        top: 8,
        overflow: "scroll",
        boxShadow: "0px 2px 16px rgba(0, 0, 0, 0.08)",
        maxHeight: activeOption.value === null ? 228 : 242,
      }}
      className="rounded-rounded relative z-50 w-[100%] border bg-white text-sm"
    >
      {showBack && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            pop();
          }}
          className="border-grey-20 hover:bg-grey-10 mb-1 flex h-[50px] cursor-pointer items-center gap-2 border-b px-3"
        >
          <UTurnIcon />
          <span className="font-medium">{activeOption.label}</span>
        </div>
      )}
      {activeOption.children!.map((o) => (
        <PopupItem
          disabled={disabled}
          option={o}
          isSelected={selected[o.value]}
          onOptionClick={onOptionClick}
          onOptionCheckboxClick={onOptionCheckboxClick}
          selectedSubcategoriesCount={selectedSubcategoriesCount[o.value]}
          key={o.value}
        />
      ))}
    </div>
  );
}

type NestedMultiselectProps = {
  options: NestedMultiselectOption[];
  onSelect: (values: string[]) => void;
  initiallySelected?: Record<string, true>;
  placeholder?: string;
  maxValuesCount?: number;
};

/**
 * Nested multiselect container
 */
function NestedMultiselect(props: NestedMultiselectProps) {
  const { options, initiallySelected, onSelect, placeholder, maxValuesCount } =
    props;
  const [isOpen, openPopup, closePopup] = useToggleState(false);

  const rootRef = React.useRef<HTMLDivElement>(null);
  useOutsideClick(closePopup, rootRef, true);

  const [activeOption, setActiveOption] = useState<NestedMultiselectOption>({
    value: null,
    label: null,
    children: options,
  });

  const [selected, setSelected] = useState<Record<string, true>>(
    initiallySelected || {}
  );

  const select = (option: NestedMultiselectOption) => {
    const nextState = { ...selected };
    nextState[option.value] = true;
    setSelected(nextState);
  };

  const deselect = (option: NestedMultiselectOption) => {
    const nextState = { ...selected };
    delete nextState[option.value];
    setSelected(nextState);
  };

  const isMaxValuesSelected = useMemo(
    () => maxValuesCount === Object.keys(selected).length,
    [selected, maxValuesCount]
  );

  const onOptionCheckboxClick = (option: NestedMultiselectOption) => {
    if (selected[option.value]) {
      deselect(option);
    } else {
      if (!isMaxValuesSelected) {
        select(option);
      }
    }
  };

  const onOptionClick = (option: NestedMultiselectOption) => {
    setActiveOption(option);
  };

  const pop = () => {
    let parent;

    const find = (o: NestedMultiselectOption) => {
      if (o.children?.some((c) => c.value === activeOption.value)) {
        parent = o;
      }
      o.children?.forEach(find);
    };

    find({ value: null, label: null, children: options });

    if (parent) {
      setActiveOption(parent);
    }
  };

  const resetSelected = () => {
    setSelected({});
    closePopup();
  };

  useEffect(() => {
    if (!isOpen) {
      setActiveOption({
        value: null,
        label: null,
        children: options,
      });
    }
  }, [isOpen]);

  useEffect(() => {
    onSelect(Object.keys(selected));
  }, [selected]);

  const selectedSubcategoriesCount = useMemo(() => {
    const counts = {};

    const visit = (option: NestedMultiselectOption) => {
      const numOfSelectedDescendants = sum(option.children?.map(visit));

      counts[option.value] = numOfSelectedDescendants;
      return selected[option.value]
        ? numOfSelectedDescendants + 1
        : numOfSelectedDescendants;
    };

    options.forEach(visit);

    return counts;
  }, [selected, options]);

  return (
    <div ref={rootRef} className=" h-[40px]">
      <Input
        isOpen={isOpen}
        openPopup={openPopup}
        resetSelected={resetSelected}
        selected={selected}
        options={options}
        placeholder={placeholder}
        disabled={!options?.length}
      />
      {isOpen && !!options?.length && (
        <Popup
          pop={pop}
          selected={selected}
          activeOption={activeOption}
          onOptionClick={onOptionClick}
          onOptionCheckboxClick={onOptionCheckboxClick}
          selectedSubcategoriesCount={selectedSubcategoriesCount}
          disabled={isMaxValuesSelected}
        />
      )}
    </div>
  );
}

export default NestedMultiselect;
