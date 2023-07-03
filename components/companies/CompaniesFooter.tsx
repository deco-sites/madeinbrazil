export default function CompaniesPage() {
  return (
    <div className="flex flex-col bg-white z-[5] md:border-x-2 border-b-2 border-black border-opacity-20">
      <div className="flex justify-between px-[102px] py-[100px] border-b-2 border-black border-opacity-20">
        <div className="flex flex-col gap-6">
          <span className="tracking-[-2.88px]">
            <span className="text-secondary text-5xl font-semibold">
              This website was&nbsp;
            </span>
            <span className="text-primary text-5xl font-semibold">
              Made in{" "}
              <span className="relative">
                Brazil.

                <div
                  className="absolute left-0 h-[16px] w-[159px] z-[-1] top-[45%]"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, rgba(22, 184, 62, 0.40) 50%, rgba(255, 225, 31, 0.60) 50%)",
                    backgroundSize: "200% 100%",
                    backgroundPosition: "137px 0",
                    transition: "background-position 2s",
                  }}
                >
                </div>
              </span>
            </span>
          </span>
          <div className="max-w-[228px]">
            <span className="text-secondary text-base font-montserrat font-medium tracking-[-0.8px]">
              Nominate a Brazilian company that should be here!
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-primary text-sm font-montserrat font-medium">
            Powered by
          </span>
          <img src="/deco-full-logo.svg" alt="Deco.cx" />
        </div>
      </div>
      <div className="flex justify-between items-center px-[102px] pt-4 pb-7">
        <div className="flex gap-4">
          <span className="text-primary text-sm font-montserrat font-medium px-3 py-2">
            Terms
          </span>
          <span className="text-primary text-sm font-montserrat font-medium px-3 py-2">
            Privacy policy
          </span>
          <span className="text-primary text-sm font-montserrat font-medium px-3 py-2">
            Cookies
          </span>
        </div>
        <div>
          <span className="text-primary text-sm font-montserrat font-normal">
            © 2023 Copyright. All Rights Reserved.
          </span>
        </div>
      </div>
    </div>
  );
}
