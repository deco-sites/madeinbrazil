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
    <div className="z-[5] bg-white">
      <div className="flex flex-col md:px-24 overflow-x-hidden relative pt-16 px-4 md:pt-32 border-b-2 md:border-x-2 border-black border-opacity-20">
        <div className="relative">
          <div
            ref={backgroundRef}
            className="absolute left-0 transform -translate-x-1/2 -translate-y-1/2 h-[10px] w-[88vw] md:h-[34px] top-[54%] md:w-[1135px]"
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
          <h1 className="relative text-primary --p font-semibold tracking-[-4.126px] leading-[90%] text-[13vw] md:text-[10.5rem] md:leading-[9rem] md:tracking-[-.75rem] z-10">
            Unleash <br />
            Brazil's <br />
            Tech Brilliance.
          </h1>

          <div className="absolute top-0 left-[63vw] md:left-[52rem] w-[14vw]">
            <img
              className="animate-[spin_12s_linear]"
              src="/stamp.png"
              alt="Stamp"
            />
          </div>
        </div>

        <div className="relative mt-14 md:mt-16">
          <p className="relative text-secondary --p font-montserrat font-normal text-xs md:text-[24px] md:leading-7 max-w-[781px]">
            Discover the game-changers, innovators, and disruptors in our
            catalog of Brazilian tech companies. Explore the forefront of
            technological advancement in Brazil.
          </p>
        </div>

        <div className="relative my-10 md:my-16">
          <button className="bg-primary text-primary-content font-medium text-base px-6 py-4 rounded-[40px] hover:bg-opacity-80 shadow-md transition ease-in-out w-full md:w-fit">
            NOMINATE A COMPANY
          </button>
        </div>
      </div>
    </div>
  );
}
