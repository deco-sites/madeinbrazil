import { useEffect, useRef, useState } from "preact/hooks";

import CompaniesUpvoteButton from "../CompaniesUpvoteButton.tsx";
import CompaniesCardTag from "./CompaniesCardTag.tsx";
import CompaniesCardLink from "./CompaniesCardLink.tsx";

import type { Company } from "deco-sites/madeinbrazil/routes/api/companies.ts";

interface Props {
  company: Company;
  isCardClicked: boolean;
  orderBy: string;
  setIsCardClicked: (isCardClicked: boolean) => void;
  fetchCompanies: (showReload: boolean) => void;
}

export default function CompaniesCard(
  { company, isCardClicked, orderBy, setIsCardClicked, fetchCompanies }: Props,
) {
  const cardRef = useRef<HTMLDivElement>(null);

  const [isCurrentCardClicked, setIsCurrentCardClicked] = useState(false);

  useEffect(() => {
    setIsCardClicked(isCurrentCardClicked);
  }, [isCurrentCardClicked]);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      cardRef.current &&
      !cardRef.current.contains(event.target as Node)
    ) {
      setIsCurrentCardClicked(false);
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
      className={`w-full cursor-pointer rounded-3xl shadow-[0_0_12px_0_rgba(0,0,0,0.2)] relative overflow-hidden mb-16 max-w-[395px] ${
        isCardClicked && !isCurrentCardClicked
          ? "opacity-40 pointer-events-none"
          : ""
      }  hover:shadow-[0_0_12px_0_rgba(0,0,0,0.4)] transition ease-in-out`}
      onClick={() => setIsCurrentCardClicked(!isCurrentCardClicked)}
      ref={cardRef}
    >
      <div className="h-full flex flex-col">
        <div className="h-[170px] bg-primary rounded-t-3xl">
          <img
            className="h-[inherit] w-full object-cover rounded-t-3xl"
            src={company.banner[0].url}
            alt={company.name}
          />
        </div>
        <div className="bg-white rounded-b-3xl relative h-[inherit]">
          <div className="flex items-center absolute top-[-32px] left-[24px] w-[64px] h-[64px] bg-white rounded-full">
            <img
              className="object-contain rounded-full"
              src={company.logo[0].url}
              alt={company.name}
            />
          </div>
          <div className="flex flex-col justify-between h-full p-6 pt-14">
            <div className="flex flex-col">
              <h2 className="text-primary font-montserrat font-semibold text-[32px]">
                {company.name}
              </h2>
              <div className="flex flex-wrap gap-2 pt-6">
                <CompaniesCardTag tag={company.employees} />
                <CompaniesCardTag tag={company.companyStage} />
                <CompaniesCardTag tag={company.capital} />
                <CompaniesCardTag tag={company.segment} />
              </div>
            </div>
            <div className="flex mt-8 h-12 relative">
              <div className="flex justify-between absolute gap-4 w-full z-10">
                <div className="flex gap-1">
                  {company.email && (
                    <CompaniesCardLink
                      href={`mailto:${company.email}`}
                      imgSrc="/email-black.svg"
                      alt="Email"
                    />
                  )}
                  {company.instagram && (
                    <CompaniesCardLink
                      href={company.instagram}
                      imgSrc="/instagram-black.svg"
                      alt="Instagram"
                    />
                  )}
                  {company.website && (
                    <CompaniesCardLink
                      href={company.website}
                      imgSrc="/link-black.svg"
                      alt="Website"
                    />
                  )}
                </div>
                {orderBy === "createdTime" && (
                  <CompaniesUpvoteButton
                    company={company}
                    fetchCompanies={fetchCompanies}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`absolute -z-10 top-0 left-0 w-full h-full bg-primary opacity-0 transition-opacity duration-300 ${
          isCurrentCardClicked ? "opacity-100 z-20" : ""
        }`}
      >
        <div className="flex flex-col items-start h-full px-8 py-12">
          <div className="flex items-start left-[40px] w-[48px] h-[48px] bg-white rounded-full">
            <img
              className="object-contain rounded-full"
              src={company.logo[0].url}
              alt={company.name}
            />
          </div>
          <div className="flex flex-col">
            <h2 className="text-white font-montserrat font-semibold text-[20px] mt-8">
              About the company
            </h2>

            <p className="text-white font-montserrat font-medium text-sm mt-6 max-h-56 overflow-y-auto scrollbar">
              {company.about}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
