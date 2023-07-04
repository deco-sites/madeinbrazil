import { useEffect, useState } from "preact/hooks";
import { LoaderReturnType } from "$live/types.ts";
import CompaniesHeader from "./CompaniesHeader.tsx";
import CompaniesList from "./CompaniesList.tsx";
import CompaniesFooter from "./CompaniesFooter.tsx";

import type {
  FilterList,
} from "deco-sites/madeinbrazil/routes/api/companies.ts";

export type Props = {
  filterList: LoaderReturnType<FilterList[]>;
};

export default function CompaniesPage({
  filterList,
}: Props) {
  const [backgroundSize, setBackgroundSize] = useState("100%");
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

  return (
    <div className="flex flex-col max-w-[1440px] m-auto md:px-6 md:border-x-2 border-black border-opacity-20 bg-white relative">
      <div
        className="fixed w-full bottom-0 left-0 flex justify-center"
        style={{ height: backgroundSize }}
      >
        <div className="w-full h-full max-w-[1440px] bg-gradient-to-r from-yellow-opaque from-50% to-green-opaque to-50% transition-all ease-in-out">
        </div>
      </div>
      <CompaniesHeader />
      <CompaniesList filterList={filterList} />
      <CompaniesFooter />
    </div>
  );
}
