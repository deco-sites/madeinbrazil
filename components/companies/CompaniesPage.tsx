import { useEffect, useState } from "preact/hooks";
import { LoaderReturnType } from "$live/types.ts";
import CompaniesHeader from "./CompaniesHeader.tsx";
import CompaniesList from "./CompaniesList.tsx";
import CompaniesFooter from "./CompaniesFooter.tsx";
import CompaniesBackToTop from "./CompaniesBackToTop.tsx";

import type {
  FilterList,
} from "deco-sites/madeinbraziltec/routes/api/companies.ts";

export type Props = {
  filterList: LoaderReturnType<FilterList[]>;
  headerTitle?: string;
  headerSubtitle?: string;
  likesThreshold?: number;
  emailLink: string;
  instagramLink: string;
};

export default function CompaniesPage({
  filterList,
  headerTitle,
  headerSubtitle,
  likesThreshold,
  emailLink,
  instagramLink,
}: Props) {
  const [backgroundSize, setBackgroundSize] = useState("0%");
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => setOffset(window.pageYOffset);

    self.removeEventListener("scroll", onScroll);
    self.addEventListener("scroll", onScroll, { passive: true });
    return () => self.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const windowHeight = window.innerHeight;
    const bodyHeight = document.body.clientHeight;
    const maxScroll = bodyHeight - windowHeight;
    const scrollPercentage = offset / maxScroll;
    const backgroundSizePercentage = scrollPercentage * 100;
    setBackgroundSize(`${backgroundSizePercentage}%`);
  }, [offset]);

  const isMobile = () => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768;
    } else return false;
  };

  return (
    <div id="top" className="flex justify-between relative">
      {!isMobile() && (
        <div className="w-6 fixed flex justify-center h-full left-0 border-r-2 border-black border-opacity-20 bg-white z-[8]">
          <div className="relative w-full h-full">
            <div
              className="absolute bottom-0 w-full bg-yellow-opaque"
              style={{ height: backgroundSize }}
            >
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col max-w-[1440px] m-auto md:px-[22px] bg-white relative">
        <CompaniesHeader
          headerTitle={headerTitle}
          headerSubtitle={headerSubtitle}
        />
        <CompaniesList
          filterList={filterList}
          likesThreshold={likesThreshold}
        />
        <CompaniesFooter email={emailLink} instagram={instagramLink} />
      </div>

      {!isMobile() && (
        <div className="w-6 fixed flex justify-center h-full right-0 border-l-2 border-black border-opacity-20 bg-white z-[8]">
          <div className="relative w-full h-full">
            <div
              className="absolute bottom-0 w-full h-full bg-green-opaque"
              style={{ height: backgroundSize }}
            >
            </div>
          </div>
        </div>
      )}

      <CompaniesBackToTop content="Back to top" />
    </div>
  );
}
