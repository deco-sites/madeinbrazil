import { useEffect, useState } from "preact/hooks";

import type { SelectedFilters } from "../../types/filters.d.ts";
import type {
  FilterList,
} from "deco-sites/madeinbraziltec/routes/api/companies.ts";

interface Props {
  selectedFilters: SelectedFilters[];
  handleSelectedFilters: (option: string | number, filter: FilterList) => void;
  filter: FilterList;
}

export default function CompaniesFilter(
  { selectedFilters, handleSelectedFilters, filter }: Props,
) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFilterSelected, setIsFilterSelected] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    // check if current filter has values selected
    const isFilterSelected = selectedFilters.find((selectedFilter) =>
      selectedFilter.name === filter.name
    )?.values.length;

    if (isFilterSelected) {
      setIsFilterSelected(true);
    } else {
      setIsFilterSelected(false);
    }
  }, [selectedFilters]);

  return (
    <div key={filter.name} className="flex flex-col relative">
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
        <div className="flex items-center pr-4 pl-6 py-2">
          <span className="text-secondary font-medium text-base pr-2 rounded-[40px] transition-all ease-in-out uppercase">
            {filter.label}
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
        <div className="flex flex-col gap-2 absolute top-[calc(100%+8px)] left-0 w-full bg-white rounded-lg shadow-md transition-all ease-in-out px-6 pt-6 pb-4 z-50">
          {filter.values.map((option) => (
            <div
              key={option}
              className="flex items-center px-2 py-3 cursor-pointer"
            >
              <input
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
                type="checkbox"
                id={option.toString()}
                onChange={() => handleSelectedFilters(option, filter)}
                checked={selectedFilters.find((selectedFilter) =>
                  selectedFilter.name === filter.name
                )?.values.includes(option.toString())}
              />
              <label
                for={option.toString()}
                className="ml-2 text-sm font-medium font-montserrat text-gray-900 dark:text-gray-300 cursor-pointer"
              >
                {option}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
