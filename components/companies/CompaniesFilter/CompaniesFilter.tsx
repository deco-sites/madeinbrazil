import { useEffect, useRef, useState } from "preact/hooks";

import CompaniesFilterItem from "./CompaniesFilterItem.tsx";

import type { FilterList } from "deco-sites/madeinbrazil/routes/api/companies.ts";
import type { SelectedFilters } from "deco-sites/madeinbrazil/types/filters.d.ts";

interface Props {
  selectedFilters: SelectedFilters[];
  handleSelectedFilters: (option: string | number, filter: FilterList) => void;
  filter: FilterList;
  applyFilters: () => void;
  clearFilters: (filterName: string) => void;
  isLoading: boolean;
}

export default function CompaniesFilter({
  selectedFilters,
  handleSelectedFilters,
  filter,
  applyFilters,
  clearFilters,
  isLoading,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFilterSelected, setIsFilterSelected] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const isFilterSelected = selectedFilters.find(
      (selectedFilter) => selectedFilter.name === filter.name,
    )?.values.length;

    if (isFilterSelected) {
      setIsFilterSelected(true);
    } else {
      setIsFilterSelected(false);
    }
  }, [selectedFilters]);

  const getSearchedFilter = (filterName: string) => {
    const searchedFilter = selectedFilters.find(
      (selectedFilter) => selectedFilter.name === filterName,
    );

    if (searchedFilter) {
      if (searchedFilter.values.length === 1) {
        return `${searchedFilter.values[0]}`;
      } else if (searchedFilter.values.length > 1) {
        return `${searchedFilter.values[0]}, +${
          searchedFilter.values.length - 1
        }`;
      } else {
        return "";
      }
    }

    return "";
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
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
      key={filter.name}
      className={`flex flex-col relative min-w-[150px] transition-all duration-300 ease-in-out`}
      ref={dropdownRef}
    >
      <button
        className={`flex rounded-[40px] w-fit hover:bg-opacity-80 transition-all ease-in-out ${
          isFilterSelected
            ? "bg-gray-opaque"
            : isOpen
            ? "bg-gray-opaque-light"
            : "bg-transparent"
        } hover:bg-gray-opaque-light`}
        onClick={toggleDropdown}
      >
        <div className="flex items-center pr-2 pl-4 py-2">
          <span className="text-secondary text-base text-sm pr-2 rounded-[40px] transition-all ease-in-out uppercase">
            {getSearchedFilter(filter.name)?.length > 0
              ? (
                <>
                  <span>{filter.label}:&nbsp;</span>
                  <span className="text-primary">
                    {getSearchedFilter(filter.name)}
                  </span>
                </>
              )
              : (
                filter.label
              )}
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
        <div className="flex flex-col gap-2 absolute top-[calc(100%+8px)] left-0 w-full bg-white rounded-lg shadow-[0_0_12px_0_rgba(0,0,0,0.2)] transition-all ease-in-out px-6 pt-6 pb-4 z-50 max-w-[230px] min-w-[230px] h-[228px]">
          <div className="flex flex-col gap-2 overflow-y-auto h-[120px] scrollbar-light">
            {filter.values.map((option) => (
              <CompaniesFilterItem
                key={option}
                selectedFilters={selectedFilters}
                option={option}
                handleSelectedFilters={handleSelectedFilters}
                filter={filter}
              />
            ))}
          </div>
          <div className="flex justify-between mt-4">
            <button
              className={`flex items-center px-4 py-2 rounded-[40px] bg-transparent hover:bg-gray-opaque transition-all ease-in-out ${
                isLoading ? "pointer-events-none" : ""
              }`}
              onClick={() => clearFilters(filter.name)}
            >
              <span className="text-base font-medium text-primary">RESET</span>
            </button>
            <button
              className={`flex items-center px-4 py-3 rounded-[40px] bg-primary hover:bg-opacity-80 transition-all ease-in-out ${
                isLoading ? "pointer-events-none" : ""
              }`}
              onClick={() => {
                applyFilters();
                toggleDropdown();
              }}
            >
              <span className="text-base font-medium text-white">APPLY</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
