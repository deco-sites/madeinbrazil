// deno-lint-ignore-file no-explicit-any
import DragAndDropImageZone from "./DragAndDropImageZone.tsx";

import type { Company } from "./CompaniesNominateForm.tsx";

interface Props {
  label: string;
  type: string;
  name: string;
  value: string;
  errors: Partial<Record<keyof Company, string>>;
  onChange: any;
}

export default function FormField({
  label,
  type,
  name,
  value,
  onChange,
  errors,
}: Props) {
  return (
    <div class="mb-6 md:mb-4">
      <label
        class="block font-montserrat text-black text-sm font-medium mb-3"
        for={name}
      >
        {label}:
      </label>
      {type === "textarea"
        ? (
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder="Enter a description..."
            class={`font-montserrat font-normal text-sm text-secondary appearance-none border rounded-lg w-full h-[134px] px-[14px] py-[10px] leading-tight focus:outline-none focus:shadow-outline resize-none
            ${errors[name] ? "border-[#F04438]" : "border-gray-opaque-dark"}
            `}
          />
        )
        : type === "file"
        ? (
          <DragAndDropImageZone
            onChange={onChange}
          />
        )
        : (
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
        )}
      {errors[name] && (
        <p class="text-xs font-montserrat text-[#F04438] mt-1">
          {errors[name]}
        </p>
      )}
    </div>
  );
}
