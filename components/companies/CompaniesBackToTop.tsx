import { useEffect, useState } from "preact/hooks";

import Icon from "$store/components/ui/Icon.tsx";

export default function CompaniesBackToTop({ content }: { content?: string }) {
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
          <div className="flex items-center justify-center fixed bottom-10 left-0 right-0 z-50">
            <a
              href="#top"
              className="btn uppercase text-white bg-primary font-medium text-sm rounded-full border-0 shadow-[0_0_16px_0_rgba(0,0,0,0.4)] hover:bg-opacity-80"
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
