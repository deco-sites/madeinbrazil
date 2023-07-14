import { useState } from "preact/hooks";

export interface Props {
  logoLink: string;
  discord: string;
  instagram: string;
}

export default function CompaniesFloatingButton(
  { logoLink = "https://deco.cx", discord, instagram }: Props,
) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="fixed bottom-10 right-16 z-50 flex flex-col gap-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <div className="flex flex-col gap-4 transition-all z-40">
          <a
            onClick={(e) => e.stopPropagation()}
            href={discord}
            className="flex items-center animate-bottomtotop275 justify-center w-14 h-12 bg-primary rounded-full hover:bg-opacity-80 shadow-md transition ease-in-out"
          >
            <img width="34px" height="34px" src="/discord.png" alt="Discord" />
          </a>
          <a
            onClick={(e) => e.stopPropagation()}
            href={instagram}
            className="flex items-center animate-bottomtotop140 justify-center w-14 h-12 bg-primary rounded-full hover:bg-opacity-80 shadow-md transition ease-in-out"
          >
            <img src="/instagram-white.svg" alt="Instagram" />
          </a>
        </div>
      )}
      <a href={logoLink} className="z-[100] cursor-pointer">
        <button className="bg-primary rounded-full shadow-md flex items-center justify-center w-14 h-14 hover:bg-opacity-80 transition-all ease-in-out">
          <img src="/deco-icon.svg" alt="Add" />
        </button>
      </a>
    </div>
  );
}
