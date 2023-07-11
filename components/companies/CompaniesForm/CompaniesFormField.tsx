// deno-lint-ignore-file no-explicit-any
import DragAndDropImageZone from "./DragAndDropImageZone.tsx";
import CompaniesFormDropdown from "./CompaniesFormDropdown.tsx";

import type { CompanyForm } from "deco-sites/madeinbrazil/types/company.d.ts";

interface Props {
  label: string;
  type: string;
  name: string;
  value: string;
  errors: Partial<Record<keyof CompanyForm, string>>;
  onChange: any;
  values?: string[];
}

export default function FormField({
  label,
  type,
  name,
  value,
  onChange,
  errors,
  values = [],
}: Props) {
  return (
    <div class="mb-6 md:mb-4 w-full">
      {type !== "file" && (
        <label
          class="block font-montserrat text-black text-sm font-medium mb-3"
          for={name}
        >
          {label}:
        </label>
      )}
      {(() => {
        switch (type) {
          case "textarea":
            return (
              <textarea
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder="Enter a description..."
                class={`font-montserrat font-normal text-sm text-secondary appearance-none border rounded-lg w-full h-[134px] px-[14px] py-[10px] leading-tight focus:outline-none focus:shadow-outline resize-none
                ${
                  errors[name] ? "border-[#F04438]" : "border-gray-opaque-dark"
                }`}
              />
            );
          case "file":
            return (
              <DragAndDropImageZone
                name={name}
                label={label}
                onChange={onChange}
              />
            );
          case "select":
            return (
              <CompaniesFormDropdown
                name={name}
                onChange={onChange}
                currentValue={value}
                values={values}
                errors={errors}
              />
            );
          default:
            return (
              <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                class={`font-montserrat font-normal text-sm text-secondary appearance-none border rounded-lg w-full px-[14px] py-[10px] leading-tight focus:outline-none focus:shadow-outline ${
                  errors[name] ? "border-[#F04438]" : "border-gray-opaque-dark"
                }`}
              />
            );
        }
      })()}
      {errors[name] && (
        <p class="text-xs font-montserrat text-[#F04438] mt-1">
          {errors[name]}
        </p>
      )}
    </div>
  );
}
