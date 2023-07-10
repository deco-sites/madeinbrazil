import { useEffect, useState } from "preact/hooks";

import { useToast } from "$store/sdk/useToast.ts";

import Icon from "$store/components/ui/Icon.tsx";

export default function Toast() {
  const { displayToast, toastContent } = useToast();

  const [currentClass, setCurrentClass] = useState("translate-y-[200%]");

  useEffect(() => {
    console.log("displayToast.value", displayToast.value);
    setCurrentClass("translate-y-0");

    setTimeout(() => {
      setCurrentClass("translate-y-[200%]");

      setTimeout(() => {
        displayToast.value = false;
      }, 400);
    }, 2000);
  }, [displayToast.value]);

  if (displayToast.value) {
    return (
      <div
        className={`fixed bottom-10 right-4 flex gap-4 rounded-lg justify-between items-center bg-primary px-8 py-6 z-[55] transition-all ease-in-out duration-300 ${currentClass}`}
      >
        <span className="text-white text-base font-montserrat font-medium">
          {toastContent.value}
        </span>
        <button
          class="btn px-4 py-3 bg-transparent hover:bg-primary-600 text-white border-none transition-all ease-in-out"
          onClick={() => {
            displayToast.value = false;
          }}
        >
          <Icon id="XMark" width={24} height={24} strokeWidth={1} fill="#FFF" />
        </button>
      </div>
    );
  }

  return null;
}
