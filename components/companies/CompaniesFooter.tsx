import { useRef, useState } from "preact/hooks";

import { useFormModal } from "$store/sdk/useFormModal.ts";
import { useUI } from "$store/sdk/useUI.ts";

import isMobile from "../helpers/isMobile.ts";

export interface Props {
  discord: string;
  instagram: string;
  logoLink?: string;
  /** @format html */
  footerText?: string;
}

export default function CompaniesFooter({
  discord,
  instagram,
  logoLink = "https://deco.cx",
  footerText,
}: Props) {
  const { displayFormModal } = useFormModal();
  const { displayTerms, displayCookies, displayPrivacy } = useUI();

  const footerTextRef = useRef<HTMLDivElement>(null);

  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="flex flex-col bg-white z-[5] md:border-x-2 border-b-2 border-black border-opacity-20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="border-b-2 border-black border-opacity-20">
        <div className="flex flex-col md:flex-row justify-between px-4 py-14 md:px-[102px] md:py-[100px] max-w-[1440px] mx-auto">
          <div className="flex flex-col gap-4 md:gap-6">
            <span className="flex flex-col md:inline-block tracking-[-1.92px] md:tracking-[-2.88px]">
              <span className="text-secondary text-[32px] md:text-5xl leading-[110%] md:leading-normal font-semibold">
                This website was&nbsp;
              </span>
              <span className="text-primary text-[32px] md:text-5xl leading-[110%] md:leading-normal font-semibold">
                Made in{" "}
                <span className="relative z-[1]">
                  Brazil.

                  <div
                    className="absolute left-0 h-[10px] md:h-[16px] w-[92px] md:w-[141px] z-[-1] top-[45%]"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, rgba(22, 184, 62, 0.40) 50%, rgba(255, 225, 31, 0.60) 50%)",
                      backgroundSize: "200% 100%",
                      backgroundPosition: isMobile() ? "70px 0" : "110px 0",
                    }}
                  >
                  </div>
                </span>
              </span>
            </span>
            <div className="flex flex-col md:gap-4 gap-6 max-w-[650px]">
              <span
                className="text-secondary text-base font-montserrat font-medium tracking-[-0.8px]"
                ref={footerTextRef}
              >
                {footerText
                  ? <span dangerouslySetInnerHTML={{ __html: footerText }} />
                  : (
                    <span>
                      This website was made in Brazil and crafted by{" "}
                      <a className="underline" href="https://deco.cx">
                        deco.cx
                      </a>, a global edge site builder, with design by Malu
                      Viana, from Recife/PE, and engineering by Flavio Odas,
                      from São Paulo/SP.
                    </span>
                  )}
              </span>
              <span className="text-secondary text-base font-montserrat font-medium tracking-[-0.8px]">
                <span
                  className="underline cursor-pointer"
                  onClick={() => displayFormModal.value = true}
                >
                  Nominate
                </span>{" "}
                a Brazilian company that should be here!
              </span>
            </div>
          </div>
          <div className="flex md:flex-col mt-14 md:mt-0 items-end justify-between gap-2 md:gap-7 md:items-center md:justify-start">
            <div className="flex flex-col gap-3 md:gap-2">
              <span className="text-primary text-sm font-montserrat font-medium">
                Powered by
              </span>
              <a href={logoLink}>
                <img
                  className="max-w-[144px] md:max-w-[100%]"
                  src="/deco-full-logo.svg"
                  alt="Deco.cx"
                  loading="lazy"
                />
              </a>
            </div>
            <div className="flex gap-4">
              {(isHovered || isMobile()) && (
                <>
                  <a
                    onClick={(e) => e.stopPropagation()}
                    href={discord}
                    className="flex items-center animate-bottomtotop140 justify-center w-14 h-12 bg-primary rounded-full hover:bg-opacity-80 transition ease-in-out"
                  >
                    <img
                      width="34px"
                      height="34px"
                      src="/discord.png"
                      alt="Discord"
                      loading="lazy"
                    />
                  </a>
                  <a
                    onClick={(e) => e.stopPropagation()}
                    href={instagram}
                    className="flex items-center animate-bottomtotop275  justify-center w-14 h-12 bg-primary rounded-full hover:bg-opacity-80 transition ease-in-out"
                  >
                    <img
                      src="/instagram-white.svg"
                      alt="Instagram"
                      loading="lazy"
                    />
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 md:px-[102px] md:pt-4 md:pb-7 max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row gap-2 md:gap-4">
            <span
              className="text-primary text-sm font-montserrat font-medium px-3 py-2 cursor-pointer hover:underline transition ease-in-out"
              onClick={() => displayTerms.value = true}
            >
              Terms
            </span>
            <span
              className="text-primary text-sm font-montserrat font-medium px-3 py-2 cursor-pointer hover:underline transition ease-in-out"
              onClick={() => displayPrivacy.value = true}
            >
              Privacy policy
            </span>
            <span
              className="text-primary text-sm font-montserrat font-medium px-3 py-2 cursor-pointer hover:underline transition ease-in-out"
              onClick={() => displayCookies.value = true}
            >
              Cookies
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
