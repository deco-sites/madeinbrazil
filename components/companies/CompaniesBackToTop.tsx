import { useEffect, useState } from "preact/hooks";

import { useOrderBy } from "$store/sdk/useOrderBy.ts";

import Icon from "$store/components/ui/Icon.tsx";

import { OrderBy } from "$store/types/orderBy.ts";

export interface Props {
  content?: string;
}

export default function CompaniesBackToTop(
  { content = "back to top" }: Props,
) {
  const { orderBy } = useOrderBy();

  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => setOffset(window.pageYOffset);

    self.removeEventListener("scroll", onScroll);
    self.addEventListener("scroll", onScroll, { passive: true });
    return () => self.removeEventListener("scroll", onScroll);
  }, []);

  if (offset > 600) {
    return (
      <>
        {content && (
          <div className="flex items-center justify-center fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
            <a
              href="#top"
              className="btn uppercase text-white bg-primary font-medium text-sm rounded-full border-0 shadow-[0_0_16px_0_rgba(0,0,0,0.4)] hover:bg-opacity-80"
              onClick={() => {
                orderBy.value = OrderBy.NEWEST;
              }}
            >
              <Icon id="ChevronUp" width={24} height={24} /> {content}
            </a>
          </div>
        )}
      </>
    );
  }

  return null;
}
