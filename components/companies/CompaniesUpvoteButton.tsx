import { useState } from "preact/hooks";

import LoadingIcon from "../utils/LoadingIcon.tsx";

import type {
  Company,
} from "deco-sites/madeinbraziltec/routes/api/companies.ts";

interface Props {
  company: Company;
  fetchCompanies: (showReload: boolean) => void;
}

export default function CompaniesUpvoteButton({
  company,
  fetchCompanies,
}: Props) {
  const [upvotes, setUpvotes] = useState(company.companyUpvotes);
  const [isUpvoting, setIsUpvoting] = useState(false);

  const handleUpvote = () => {
    setUpvotes(upvotes + 1);
    setIsUpvoting(true);

    fetch(`/api/companies/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: company.id,
        companyUpvotes: company.companyUpvotes + 1,
      }),
    }).then((res) => res.json()).then((data) => {
      if (data) {
        console.log(data);
      }
      fetchCompanies(false);
      setIsUpvoting(false);
    }).catch((err) => {
      console.log(err);
      setUpvotes(upvotes - 1);
    }).finally(() => {
      setIsUpvoting(false);
    });
  };

  return (
    <button
      className={`flex items-center gap-4 px-4 py-3 h-12 bg-primary rounded-full hover:bg-opacity-80 shadow-md transition ease-in-out ${
        isUpvoting ? "opacity-40 pointer-events-none" : ""
      }`}
      onClick={(e) => {
        e.stopPropagation();
        handleUpvote();
      }}
    >
      <img src="/like.svg" alt="Likes" />
      <span>
        {isUpvoting
          ? (
            <LoadingIcon
              widthPx="20px"
              heightPx="20px"
            />
          )
          : upvotes}
      </span>
    </button>
  );
}
