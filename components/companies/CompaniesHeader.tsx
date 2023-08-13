import { useFormModal } from "$store/sdk/useFormModal.ts";
import { useEffect, useState } from "preact/hooks";

export interface Props {
  /** @format html */
  headerTitle?: string;
  headerSubtitle?: string;
  /** @description Use "unset" to reset default values */
  customStampPosition?: {
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
  };
}

export default function CompaniesHeader({
  headerTitle,
  headerSubtitle,
  customStampPosition,
}: Props) {
  const { displayFormModal } = useFormModal();

  const [isHovering, setIsHovering] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    setIsSpinning(true);
    setTimeout(() => {
      setIsSpinning(false);
    }, 12000);
  }, [isHovering]);

  return (
    <>
      <div className="z-[5] bg-white border-b-2 border-black border-opacity-20 md:px-[22px]">
        <div className="flex flex-col md:px-24 overflow-x-hidden relative pt-16 px-4 md:pt-32 max-w-[1240px] mx-auto">
          <div className="relative">
            <h1 className="relative text-primary --p font-semibold tracking-[-4.126px] leading-[90%] text-[12vw] md:text-[12vw] min-[1359px]:leading-[9rem] md:tracking-[-.75rem] min-[1359px]:text-[9rem] z-10">
              <>
                <div className="absolute left-0 h-[10px] w-[70vw] md:h-[34px] top-[50%] md:w-[38vw] min-[1359px]:w-[656px] z-[-1]">
                  <div className="relative w-full h-full">
                    <div className="absolute animate-widthlefttoright70 left-0 w-[70%] h-full bg-white z-[2]">
                      <div className="w-full h-full bg-yellow-opaque" />
                    </div>

                    <div className="absolute animate-widthlefttoright100 left-0 w-full h-full bg-white z-[1]">
                      <div className="w-full h-full bg-green-opaque" />
                    </div>
                  </div>
                </div>
                {headerTitle
                  ? <span dangerouslySetInnerHTML={{ __html: headerTitle }} />
                  : (
                    <span>
                      Brazil Tech,<br />
                      Global Reach
                    </span>
                  )}
              </>
            </h1>

            <div
              className="absolute top-0 left-[63vw] md:left-[55vw] min-[1359px]:left-[52rem] w-[16vw] md:w-[14vw] z-[11]"
              style={customStampPosition}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <img
                className={`${
                  isSpinning ? "animate-[spin_12s_linear_infinite]" : ""
                }`}
                src="/stamp.png"
                alt="Stamp"
                width={180}
                height={180}
              />
            </div>
          </div>

          <div className="relative mt-10 md:mt-12">
            <p className="relative text-primary --p font-montserrat font-normal md:text-[24px] md:leading-7 max-w-[760px]">
              {headerSubtitle}
            </p>
          </div>

          <div className="relative my-8 md:my-12">
            <button
              className="bg-primary text-primary-content font-medium
             text-base px-6 py-4 rounded-[40px] hover:bg-opacity-80 shadow-md
              transition ease-in-out w-full md:w-fit"
              onClick={() => displayFormModal.value = true}
            >
              NOMINATE A COMPANY
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
