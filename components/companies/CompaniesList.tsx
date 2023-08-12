import { useEffect, useRef, useState } from "preact/hooks";

import { useOrderBy } from "$store/sdk/useOrderBy.ts";

import CompaniesCard from "./CompaniesCard/CompaniesCard.tsx";
import CompaniesCardLoader from "./CompaniesCard/CompaniesCardLoader.tsx";
import CompaniesFilter from "./CompaniesFilter/CompaniesFilter.tsx";
import type {
  Company,
  CompanyResponse,
  FilterList,
} from "deco-sites/madeinbrazil/routes/api/companies.ts";

import { OrderBy } from "$store/types/orderBy.ts";

export type Props = {
  filterList: FilterList[] | undefined;
  likesThreshold?: number;
  orderByMostPopularText?: string;
  orderByAllText?: string;
  likeButtonVisibleIn?: "MOST POPULAR" | "ALL" | "BOTH";
};

interface GetCompanyResponse {
  data: CompanyResponse;
  status: number;
}

interface SelectedFilters {
  name: string;
  values: string[];
}

export default function CompaniesList(
  {
    filterList,
    likesThreshold = 0,
    orderByMostPopularText = "MOST POPULAR",
    orderByAllText = "ALL",
    likeButtonVisibleIn = "BOTH",
  }: Props,
) {
  const listRef = useRef<HTMLDivElement>(null);

  const { orderBy } = useOrderBy();

  const [companiesList, setCompaniesList] = useState([] as Company[]);

  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isCardClicked, setCardClicked] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const [offset, setOffset] = useState<string | null>(null);

  const fetchCompanies = (showReload = true) => {
    const filtersQueryString = selectedFilters.reduce((acc, curr) => {
      const values = curr.values.join(",");
      return `${acc}&${curr.name}=${encodeURIComponent(values)}`;
    }, "");

    const likesQueryString = `&likesThreshold=${
      orderBy.value === OrderBy.MOST_POPULAR ? likesThreshold.toString() : "0"
    }`;

    showReload && setIsLoading(true);
    fetch(
      `/api/companies?orderBy=${orderBy.value}${filtersQueryString}${likesQueryString}`,
      {
        method: "GET",
      },
    ).then((res) => res.json()).then(
      (data: GetCompanyResponse) => {
        setCompaniesList(data.data.companyList);
        setOffset(data.data?.offset ?? null);
      },
    ).finally(() => {
      showReload && setIsLoading(false);
    });
  };

  const fetchMoreCompanies = () => {
    if (!offset || isLoading || isFetchingMore) {
      return;
    }

    const filtersQueryString = selectedFilters.reduce((acc, curr) => {
      const values = curr.values.join(",");
      return `${acc}&${curr.name}=${values}`;
    }, "");

    const likesQueryString = `&likesThreshold=${
      orderBy.value === OrderBy.MOST_POPULAR ? likesThreshold.toString() : "0"
    }`;

    setIsFetchingMore(true);
    fetch(
      `/api/companies?orderBy=${orderBy.value}${filtersQueryString}${likesQueryString}&offset=${offset}`,
      {
        method: "GET",
      },
    )
      .then((res) => res.json())
      .then((data: GetCompanyResponse) => {
        setCompaniesList((prevCompanies) => {
          return [...prevCompanies, ...data.data.companyList];
        });
        setOffset(data.data?.offset ?? null);
      })
      .finally(() => {
        setIsFetchingMore(false);
      });
  };

  useEffect(() => {
    fetchCompanies();
  }, [orderBy.value]);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } =
        self.document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 480) {
        fetchMoreCompanies();
      }
    };

    self.addEventListener("scroll", handleScroll);
    return () => {
      self.removeEventListener("scroll", handleScroll);
    };
  }, [offset, isLoading, isFetchingMore]);

  const applyFilters = () => {
    fetchCompanies();
  };

  const clearFilters = (filterName: string) => {
    setSelectedFilters((prevFilters) => {
      const newFilters = prevFilters.filter((filter) =>
        filter.name !== filterName
      );
      return newFilters;
    });
  };

  const handleOrderBy = () => {
    if (orderBy.value === OrderBy.MOST_POPULAR) {
      orderBy.value = OrderBy.NEWEST;
    } else {
      orderBy.value = OrderBy.MOST_POPULAR;
    }
  };

  const handleSelectedFilters = (
    option: string | number,
    filter: FilterList,
  ) => {
    setSelectedFilters((prevFilters) => {
      const optionString = option.toString();

      const filterIndex = prevFilters.findIndex((selectedFilter) =>
        selectedFilter.name === filter.name
      );

      if (filterIndex === -1) {
        const newFilter = {
          name: filter.name,
          values: [optionString],
        };
        return [...prevFilters, newFilter];
      }

      const selectedValues = prevFilters[filterIndex].values;
      const valueIndex = selectedValues.findIndex((value) =>
        value === optionString
      );

      if (valueIndex !== -1) {
        const newSelectedFilters = [...prevFilters];
        newSelectedFilters[filterIndex].values.splice(valueIndex, 1);
        return newSelectedFilters;
      }

      const newSelectedFilters = [...prevFilters];
      newSelectedFilters[filterIndex].values.push(optionString);
      return newSelectedFilters;
    });
  };

  return (
    <div
      className="min-h-[calc(100vh-98px)] text-zinc-100 flex justify-between flex-col mx-auto z-[5] w-full border-b-2 border-black border-opacity-20 md:px-[22px]"
      ref={listRef}
    >
      <div className="flex flex-col mx-auto max-w-[1440px] min-h-[calc(100vh-98px)] w-full bg-white  px-4 md:px-24 items-center md:items-start">
        <div className="flex flex-col justify-between items-center mt-10 w-full">
          <div className="flex flex-wrap justify-start gap-4 w-full transition-all ease-in-out">
            {filterList?.map((filter) => (
              <CompaniesFilter
                key={filter.name}
                filter={filter}
                handleSelectedFilters={handleSelectedFilters}
                selectedFilters={selectedFilters}
                applyFilters={applyFilters}
                clearFilters={clearFilters}
                isLoading={isLoading}
              />
            ))}
          </div>
          <div className="w-full">
            <div className="mt-10 w-full">
              {isLoading
                ? (
                  <div className="grid justify-items-center min-[744px]:grid-cols-2 min-[744px]:gap-8 min-[1024px]:gap-12 min-[1440px]:grid-cols-3 w-full">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <CompaniesCardLoader key={index} />
                    ))}
                  </div>
                )
                : companiesList.length
                ? (
                  <div className="grid justify-items-center min-[744px]:grid-cols-2 min-[744px]:gap-8 min-[1024px]:gap-12 min-[1440px]:grid-cols-3 w-full">
                    {companiesList.map((company) => (
                      <CompaniesCard
                        key={company.id}
                        company={company}
                        isCardClicked={isCardClicked}
                        orderBy={orderBy.value}
                        setIsCardClicked={setCardClicked}
                        fetchCompanies={fetchCompanies}
                        likeButtonVisibleIn={likeButtonVisibleIn}
                      />
                    ))}
                  </div>
                )
                : (
                  <div className="flex justify-center items-center h-[calc(100vh-98px)]">
                    <h1 className="text-3xl">No companies found</h1>
                  </div>
                )}
              {isFetchingMore && (
                <div className="grid justify-items-center min-[744px]:grid-cols-2 min-[744px]:gap-8 min-[1024px]:gap-12 min-[1300px]:grid-cols-3 w-full">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <CompaniesCardLoader key={index} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
