import { useEffect, useState } from "preact/hooks";

import CompaniesCard from "./CompaniesCard.tsx";
import LoadingIcon from "../utils/LoadingIcon.tsx";
import type {
  Company,
} from "deco-sites/madeinbraziltec/routes/api/companies.ts";

enum OrderBy {
  MOST_POPULAR = "companyUpvotes",
  NEWEST = "createdTime",
}

interface CompanyResponse {
  data: Company[];
  status: number;
}

export default function CompaniesList() {
  const [isCardClicked, setCardClicked] = useState(false);
  const [orderBy, setOrderBy] = useState(OrderBy.MOST_POPULAR);
  const [companiesList, setCompaniesList] = useState([] as Company[]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch(
      `/api/companies?orderBy=${orderBy}`,
      {
        method: "GET",
      },
    ).then((res) => res.json()).then(
      (data: CompanyResponse) => {
        setCompaniesList(data.data);
      },
    ).finally(() => {
      setIsLoading(false);
    });
  }, [orderBy]);

  const handleOrderBy = () => {
    setOrderBy(() => {
      if (orderBy === OrderBy.MOST_POPULAR) {
        return OrderBy.NEWEST;
      }
      return OrderBy.MOST_POPULAR;
    });
  };

  return (
    <div className="min-h-[calc(100vh-98px)] text-zinc-100 flex justify-between flex-col md:px-10 mx-auto bg-gradient-to-r from-yellow-opaque from-50% to-green-opaque to-50%">
      <div className="flex flex-col mx-auto justify-between max-w-[1375px] bg-white border-x-2 border-black border-opacity-20 pt-14 px-24">
        <button
          onClick={() => handleOrderBy()}
          className="flex bg-gray-opaque rounded-[40px] w-fit"
        >
          <div className="flex it ems-center px-2 py-3">
            <span
              className={`${
                orderBy === OrderBy.MOST_POPULAR
                  ? "text-white bg-primary"
                  : "text-secondary"
              } font-medium text-base px-4 py-3 rounded-[40px] transition-all ease-in-out`}
            >
              MOST POPULAR
            </span>
            <span
              className={`${
                orderBy === OrderBy.NEWEST
                  ? "text-white bg-primary"
                  : "text-secondary"
              } font-medium text-base px-4 py-3 rounded-[40px] transition-all ease-in-out`}
            >
              NEWEST
            </span>
          </div>
        </button>
        <div>
          <div className="mt-14">
            {companiesList.length
              ? (
                <div className="flex flex-wrap justify-between gap-16">
                  {companiesList.map((company) => (
                    <CompaniesCard
                      key={company.id}
                      company={company}
                      isCardClicked={isCardClicked}
                      setIsCardClicked={setCardClicked}
                    />
                  ))}
                </div>
              )
              : isLoading
              ? <LoadingIcon />
              : (
                <div className="flex justify-center items-center h-[calc(100vh-98px)]">
                  <h1 className="text-3xl">No companies found</h1>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
