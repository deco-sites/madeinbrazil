// deno-lint-ignore-file no-explicit-any
import { useEffect, useRef, useState } from "preact/hooks";

import type { CompanyForm } from "deco-sites/madeinbrazil/types/company.d.ts";

interface Props {
  name: string;
  values: string[];
  currentValue: string;
  errors: Partial<Record<keyof CompanyForm, string>>;
  onChange: any;
}

export default function CompaniesFormDropdown({
  name,
  currentValue,
  values,
  errors,
  onChange,
}: Props) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = (e: any) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current && !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    self.addEventListener("click", handleClickOutside);
    return () => {
      self.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="form-group relative transition-all duration-300 ease-in-out"
      ref={dropdownRef}
    >
      <button
        className={`w-full font-montserrat font-normal border border-gray-opaque-dark rounded-lg text-sm text-secondary appearance-none px-[14px] py-[10px] leading-tight focus:outline-none focus:shadow-outline cursor-pointer
        ${errors[name] ? "border-[#F04438]" : "border-gray-opaque-dark"}
        `}
        onClick={toggleDropdown}
      >
        <div className="flex items-center justify-between">
          <span className="text-secondary font-montserrat font-normal text-sm transition-all ease-in-out">
            {currentValue || "Select..."}
          </span>
          <span
            className={`ml-2 transition-all ease-in-out transform ${
              isOpen ? "rotate-180" : ""
            }`}
          >
            <img src="/caret-down.svg" alt="Arrow Down" />
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="flex flex-col gap-2 absolute top-[calc(100%+8px)] left-0 w-full bg-white rounded-lg shadow-[0_0_12px_0_rgba(0,0,0,0.2)] transition-all ease-in-out px-0 py-1 z-50 max-h-[200px]">
          <div className="flex flex-col overflow-y-auto h-full max-h-[200px] scrollbar-light">
            {values.map((option, index) => (
              <button
                key={index + option}
                onClick={(e) => {
                  e.preventDefault();
                  onChange(option, name);
                  toggleDropdown(e);
                }}
                className="flex items-center px-[14px] py-[10px] hover:bg-gray-opaque-light transition-all ease-in-out"
              >
                <span className="pl-2 text-sm font-medium font-montserrat text-primary cursor-pointer">
                  {option}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
