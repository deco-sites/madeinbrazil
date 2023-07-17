import Button from "$store/components/ui/Button.tsx";
import { useEffect, useRef } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { useSignal } from "@preact/signals";
import type { JSX } from "preact";

import Icon from "./Icon.tsx";

// Lazy load a <dialog> polyfill.
if (IS_BROWSER && typeof window.HTMLDialogElement === "undefined") {
  await import(
    "https://raw.githubusercontent.com/GoogleChrome/dialog-polyfill/5033aac1b74c44f36cde47be3d11f4756f3f8fda/dist/dialog-polyfill.esm.js"
  );
}

export type Props = JSX.IntrinsicElements["dialog"] & {
  title?: string;
  subtitle?: string;
  mode?: "sidebar-right" | "sidebar-left" | "sidebar-bottom" | "center";
  onClose?: () => Promise<void> | void;
  loading?: "lazy" | "eager";
};

const dialogStyles = {
  "sidebar-right": "animate-slide-left",
  "sidebar-left": "animate-slide-right",
  "sidebar-bottom": "animate-bottomtotop140",
  center: "animate-fade-in",
};

const sectionStyles = {
  "sidebar-right": "justify-end",
  "sidebar-left": "justify-start",
  "sidebar-bottom": "justify-center",
  center: "justify-center items-center",
};

const containerStyles = {
  "sidebar-right": "h-full w-full sm:max-w-lg",
  "sidebar-left": "h-full w-full sm:max-w-lg",
  "sidebar-bottom": "h-full w-full sm:max-w-lg",
  center: "",
};

const Modal = ({
  open,
  title,
  subtitle,
  mode = "sidebar-right",
  onClose,
  children,
  loading,
  ...props
}: Props) => {
  const lazy = useSignal(false);
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (open === false) {
      document.getElementsByTagName("body").item(0)?.classList.remove(
        "no-scroll",
      );
      ref.current?.open === true && ref.current.close();
    } else if (open === true) {
      document.getElementsByTagName("body").item(0)?.classList.add(
        "no-scroll",
      );
      ref.current?.open === false && ref.current.showModal();
      lazy.value = true;
    }
  }, [open]);

  return (
    <dialog
      {...props}
      ref={ref}
      class={`bg-transparent p-0 m-0 w-full max-h-full h-full backdrop-opacity-50 ${
        dialogStyles[mode]
      } ${props.class ?? ""}`}
      onClick={(e) =>
        (e.target as HTMLDialogElement).tagName === "DIALOG" && onClose?.()}
      onClose={onClose}
    >
      <section
        class={`relative w-full h-full flex bg-transparent pr-4 
        md:pr-[9px] pl-0 pt-16 pb-8 ${sectionStyles[mode]}`}
      >
        <div
          class={`bg-base-100 flex flex-col max-h-full w-full ${
            containerStyles[mode]
          }`}
        >
          <header class="flex pl-4 md:pl-[57px] pb-10 md:pb-6 justify-between items-center">
            <div class="flex flex-col gap-3">
              <h2>
                <span class="font-medium md:font-semibold font-montserrat text-primary text-[20px]">
                  {title}
                </span>
              </h2>
              <p class="text-secondary text-sm font-medium font-montserrat">
                {subtitle}
              </p>
            </div>
            <Button
              class="btn btn-ghost absolute right-[2%] top-[20px]"
              onClick={onClose}
            >
              <Icon id="XMark" width={24} height={24} strokeWidth={1} />
            </Button>
          </header>
          <div class="overflow-y-auto flex-grow flex flex-col scrollbar-light pl-4 md:pl-[57px] pr-[10px] md:pr-[37px]">
            {loading === "lazy" ? lazy.value && children : children}
          </div>
        </div>
      </section>
    </dialog>
  );
};

export default Modal;
