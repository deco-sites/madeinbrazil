import { useEffect, useState } from "preact/hooks";
import type { Company } from "deco-sites/madeinbraziltec/routes/api/companies.ts";

interface Props {
  company: Company;
  isCardClicked: boolean;
  setIsCardClicked: (isCardClicked: boolean) => void;
}

export default function CompaniesList(
  { company, isCardClicked, setIsCardClicked }: Props,
) {
  const [isCurrentCardClicked, setIsCurrentCardClicked] = useState(false);

  useEffect(() => {
    setIsCardClicked(isCurrentCardClicked);
  }, [isCurrentCardClicked]);

  const formatEmployees = (employees: number) => {
    const formatter = new Intl.NumberFormat("en-US", {
      notation: "compact",
      compactDisplay: "short",
    });

    return `${formatter.format(employees)}+ employees`;
  };

  return (
    <div
      className={`w-[calc(50%-32px)] cursor-pointer rounded-3xl shadow-[0_0_12px_0_rgba(0,0,0,0.2)] relative overflow-hidden mb-16 max-w-[590px] ${
        isCardClicked && !isCurrentCardClicked
          ? "opacity-40 pointer-events-none"
          : ""
      }  hover:shadow-[0_0_12px_0_rgba(0,0,0,0.4)] transition ease-in-out`}
      onClick={() => setIsCurrentCardClicked(!isCurrentCardClicked)}
    >
      <div>
        <div className="h-[266px] bg-primary rounded-t-3xl">
          <img
            className="h-full w-full object-cover rounded-t-3xl"
            src={company.banner[0].url}
            alt={company.name}
          />
        </div>
        <div className="bg-white rounded-b-3xl relative">
          <div className="flex items-center absolute top-[-40px] left-[40px] w-[80px] h-[80px] bg-white rounded-full">
            <img
              className="object-contain rounded-full"
              src={company.logo[0].url}
              alt={company.name}
            />
          </div>
          <div className="flex flex-col justify-between h-full p-8 pt-20">
            <div className="flex flex-col">
              <h2 className="text-primary font-montserrat font-semibold text-[40px]">
                {company.name}
              </h2>
              <div className="flex flex-wrap gap-3 pt-6">
                <span className="text-primary font-montserrat font-medium text-sm px-4 py-3 bg-neutral bg-opacity-20 rounded-[40px] border border-primary-opaque">
                  {formatEmployees(company.employees)}
                </span>
                <span className="text-primary font-montserrat font-medium text-sm px-4 py-3 bg-neutral bg-opacity-20 rounded-[40px] border border-primary-opaque">
                  {company.companyStage}
                </span>
                <span className="text-primary font-montserrat font-medium text-sm px-4 py-3 bg-neutral bg-opacity-20 rounded-[40px] border border-primary-opaque">
                  {company.capital}
                </span>
                <span className="text-primary font-montserrat font-medium text-sm px-4 py-3 bg-neutral bg-opacity-20 rounded-[40px] border border-primary-opaque">
                  {company.segment}
                </span>
              </div>
            </div>
            <div className="flex gap-4 pt-12">
              <a
                href={`mailto:${company.email}`}
                className="flex items-center justify-center w-14 h-12 bg-primary rounded-full"
              >
                <img src="/email.svg" alt="Email" />
              </a>
              <a
                href={company.instagram}
                className="flex items-center justify-center w-14 h-12 bg-primary rounded-full"
              >
                <img src="/instagram.svg" alt="Instagram" />
              </a>
              <a
                href={company.website}
                className="flex items-center justify-center w-14 h-12 bg-primary rounded-full"
              >
                <img src="/website.svg" alt="Website" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`absolute top-0 left-0 w-full h-full bg-primary opacity-0 transition-opacity duration-300 ${
          isCurrentCardClicked ? "opacity-100 " : ""
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

            <p className="text-white font-montserrat font-medium text-sm mt-6">
              {company.about}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
