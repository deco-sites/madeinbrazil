import { useEffect, useState } from "preact/hooks";

import type {
  FilterList,
} from "deco-sites/madeinbrazil/routes/api/companies.ts";

import type { SelectedFilters } from "deco-sites/madeinbrazil/types/filters.d.ts";

interface Props {
  selectedFilters: SelectedFilters[];
  option: string | number;
  handleSelectedFilters: (option: string | number, filter: FilterList) => void;
  filter: FilterList;
}

export default function CompaniesFilterItem({
  selectedFilters,
  option,
  handleSelectedFilters,
  filter,
}: Props) {
  const [isSelected, setIsSelected] = useState(false);

  const checkIfFilterIsSelected = (
    currentName: string,
    option: string | number,
  ) => {
    return selectedFilters.find((selectedFilter) =>
      selectedFilter.name === currentName
    )?.values.includes(option.toString()) || false;
  };

  useEffect(() => {
    setIsSelected(checkIfFilterIsSelected(filter.name, option));
  }, [selectedFilters]);

  return (
    <div
      key={option}
      className="flex items-center px-2"
    >
      <input
        className={`cursor-pointer w-4 h-4 form-checkbox rounded border focus:ring-0 focus:ring-transparent border-primary-opaque hover:border-primary-opaque-dark ring-transparent checked:border-primary-opaque ${
          isSelected
            ? "text-gray-opaque hover:text-gray-opaque-dark border-primary-opaque"
            : "bg-white hover:bg-gray-opaque text-white"
        }
          `}
        type="checkbox"
        id={option.toString()}
        onChange={() => handleSelectedFilters(option, filter)}
        checked={isSelected}
      />
      <label
        for={option.toString()}
        className="pl-2 text-sm font-medium font-montserrat text-primary cursor-pointer"
      >
        {option}
      </label>
    </div>
  );
}
