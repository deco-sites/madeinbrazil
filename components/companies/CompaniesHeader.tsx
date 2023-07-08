import { useEffect, useRef } from "preact/hooks";

interface Props {
  headerTitle?: string;
  headerSubtitle?: string;
}

export default function CompaniesHeader({
  headerTitle,
  headerSubtitle,
}: Props) {
  return (
    <div className="z-[5] bg-white border-b-2 border-black border-opacity-20 md:px-[22px]">
      <div className="flex flex-col md:px-24 overflow-x-hidden relative pt-16 px-4 md:pt-32 max-w-[1440px] mx-auto">
        <div className="relative">
          <h1 className="relative text-primary --p font-semibold tracking-[-4.126px] leading-[90%] text-[13vw] md:text-[10.5rem] md:leading-[9rem] md:tracking-[-.75rem] z-10">
            {headerTitle || (
              <>
                <div className="absolute left-0 h-[10px] w-[88vw] md:h-[34px] top-[50%] md:w-[562px] z-[-1]">
                  <div className="relative w-full h-full">
                    <div className="absolute animate-widthlefttoright80 left-0 w-[80%] h-full bg-white z-[2]">
                      <div className="w-full h-full bg-yellow-opaque" />
                    </div>

                    <div className="absolute animate-widthlefttoright100 left-0 w-full h-full bg-white z-[1]">
                      <div className="w-full h-full bg-green-opaque" />
                    </div>
                  </div>
                </div>
                Unleash <br />
                Brazil's <br />
                Tech Brilliance.
              </>
            )}
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
            {headerSubtitle || (
              "Discover the game-changers, innovators, and disruptors in our catalog of Brazilian tech companies. Explore the forefront oftechnological advancement in Brazil."
            )}
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
