import { useEffect, useState } from "preact/hooks";

import LoadingIcon from "../utils/LoadingIcon.tsx";

// import { getCookie, setCookie } from "../../functions/cookieUtils.ts";

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
  const [isUpvoted, setIsUpvoted] = useState(false);

  function setCookie(name: string, value: string, years: number) {
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + years);

    const cookieString = `${encodeURIComponent(name)}=${
      encodeURIComponent(
        value,
      )
    };expires=${expirationDate.toUTCString()};path=/`;
    document.cookie = cookieString;
  }

  function getCookie(name: string): string | null {
    const encodedName = encodeURIComponent(name);
    const cookieArray = document.cookie.split(";");

    for (const cookie of cookieArray) {
      const [cookieName, cookieValue] = cookie.split("=");
      if (cookieName.trim() === encodedName) {
        return decodeURIComponent(cookieValue);
      }
    }

    return null;
  }

  const checkIfCompanyIsUpvoted = (companyId: string): boolean => {
    const upvotedCompanies = getCookie("upvotedCompanies");

    if (upvotedCompanies && companyId) {
      const parsedUpvotedCompanies = JSON.parse(upvotedCompanies) as string[];

      return parsedUpvotedCompanies.includes(companyId);
    }

    return false;
  };

  useEffect(() => {
    company?.id && setIsUpvoted(checkIfCompanyIsUpvoted(company.id));
  }, [company]);

  const handleUpvote = () => {
    if (isUpvoted) return;

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

      const upvotedCompanies = getCookie("upvotedCompanies");

      if (company.id) {
        if (upvotedCompanies) {
          const parsedUpvotedCompanies = JSON.parse(
            upvotedCompanies,
          ) as string[];
          parsedUpvotedCompanies.push(company?.id);
          setCookie(
            "upvotedCompanies",
            JSON.stringify(parsedUpvotedCompanies),
            2,
          );
        } else {
          setCookie("upvotedCompanies", JSON.stringify([company?.id]), 2);
        }
      }

      setIsUpvoted(true);
    }).catch((err) => {
      console.error(err);
      setUpvotes(upvotes - 1);
    }).finally(() => {
      setIsUpvoting(false);
    });
  };

  return (
    <button
      className={`flex items-center gap-4 px-4 py-3 h-12 bg-primary rounded-full hover:bg-opacity-80 shadow-md transition ease-in-out ${
        isUpvoting ? "opacity-40 pointer-events-none" : ""
      } ${isUpvoted ? "bg-opacity-80 cursor-not-allowed" : ""} `}
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
