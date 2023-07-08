import { useEffect, useState } from "preact/hooks";

import isMobile from "../helpers/isMobile.ts";

export default function CompaniesScrollBar() {
  const [isMobileLayout, setIsMobileLayout] = useState(false);
  const [backgroundSize, setBackgroundSize] = useState("0%");
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    setIsMobileLayout(isMobile());

    const onResize = () => setIsMobileLayout(isMobile());
    const onScroll = () => setOffset(window.pageYOffset);

    self.removeEventListener("resize", onResize);
    self.addEventListener("resize", onResize, { passive: true });
    self.removeEventListener("scroll", onScroll);
    self.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      self.removeEventListener("scroll", onScroll);
      self.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    const windowHeight = window.innerHeight;
    const bodyHeight = document.body.clientHeight;
    const maxScroll = bodyHeight - windowHeight;
    const scrollPercentage = offset / maxScroll;
    const backgroundSizePercentage = scrollPercentage * 100;
    setBackgroundSize(`${backgroundSizePercentage}%`);
  }, [offset]);

  return !isMobileLayout
    ? (
      <>
        <div className="w-6 fixed flex justify-center h-full left-0 border-r-2 border-black border-opacity-20 bg-white z-[8]">
          <div className="relative w-full h-full">
            <div
              className="absolute bottom-0 w-full bg-yellow-opaque"
              style={{ height: backgroundSize }}
            >
            </div>
          </div>
        </div>
        <div className="w-6 fixed flex justify-center h-full right-0 border-l-2 border-black border-opacity-20 bg-white z-[8]">
          <div className="relative w-full h-full">
            <div
              className="absolute bottom-0 w-full h-full bg-green-opaque"
              style={{ height: backgroundSize }}
            >
            </div>
          </div>
        </div>
      </>
    )
    : (
      null
    );
}
