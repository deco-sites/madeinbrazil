import { useEffect, useRef } from "preact/hooks";

export default function CompaniesHeader() {
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = backgroundRef.current;
    if (element) {
      const timer = setTimeout(() => {
        element.style.backgroundPosition = "-89.5% 0px";
      }, 100);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="border-b-2 border-x-2 border-black border-opacity-20 max-w-[1375px] m-auto">
      <div className="flex flex-col mx-24 overflow-x-hidden relative pt-32">
        <div className="relative">
          <div
            ref={backgroundRef}
            className="absolute left-0 transform -translate-x-1/2 -translate-y-1/2 h-[34px] top-[54%] w-[1135px]"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(22, 184, 62, 0.40) 50%, rgba(255, 225, 31, 0.60) 50%)",
              backgroundSize: "200% 100%",
              backgroundPosition: "0 0",
              transition: "background-position 2s",
              zIndex: 1,
            }}
          >
          </div>
          <h1 className="relative text-primary --p font-semibold text-[10.5rem] leading-[9rem] tracking-[-.75rem] z-10">
            Unleash <br />
            Brazil's <br />
            Tech Brilliance.
          </h1>

          <div className="absolute top-0 left-[52rem]">
            <img
              className="animate-[spin_12s_linear]"
              src="/stamp.png"
              alt="Stamp"
            />
          </div>
        </div>

        <div className="relative mt-16">
          <p className="relative text-secondary --p font-montserrat font-normal text-[24px] leading-7 max-w-[781px]">
            Discover the game-changers, innovators, and disruptors in our
            catalog of Brazilian tech companies. Explore the forefront of
            technological advancement in Brazil.
          </p>
        </div>

        <div className="relative mt-16 mb-16">
          <button className="bg-primary text-primary-content font-medium text-base px-6 py-4 rounded-[40px] hover:bg-opacity-80 shadow-md transition ease-in-out">
            NOMINATE A COMPANY
          </button>
        </div>
      </div>
    </div>
  );
}
