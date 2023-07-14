import { useUI } from "$store/sdk/useUI.ts";

import Modal from "$store/components/ui/Modal.tsx";

import isMobile from "../helpers/isMobile.ts";

export interface ModalProps {
  title: string;
  /** @format html */
  content: string;
}

export interface Props {
  terms: ModalProps;
  privacy: ModalProps;
  cookies: ModalProps;
}

export default function CompaniesModals({ cookies, privacy, terms }: Props) {
  const { displayTerms, displayCookies, displayPrivacy } = useUI();

  return (
    <>
      <Modal
        title={terms.title}
        loading="lazy"
        mode={isMobile() ? "sidebar-bottom" : "center"}
        className="w-full h-[95%] top-auto md:top-0 md:h-full overflow-hidden max-w-none max-h-none md:max-w-[792px] 
        md:max-h-[628px] rounded-[40px] shadow-[0_0_12_0_rgba(0,0,0,0.2)] scrollbar-light pr-4 
        md:pr-[9px] pl-0 pt-16 pb-8"
        open={displayTerms.value}
        onClose={() => {
          displayTerms.value = false;
        }}
      >
        <div
          className="w-full mx-auto pb-10"
          dangerouslySetInnerHTML={{ __html: terms.content }}
        />
      </Modal>

      <Modal
        title={privacy.title}
        loading="lazy"
        mode={isMobile() ? "sidebar-bottom" : "center"}
        className="w-full h-[95%] top-auto md:top-0 md:h-full overflow-hidden max-w-none max-h-none md:max-w-[792px] 
        md:max-h-[628px] rounded-[40px] shadow-[0_0_12_0_rgba(0,0,0,0.2)] scrollbar-light pr-4 
        md:pr-[9px] pl-0 pt-16 pb-8"
        open={displayPrivacy.value}
        onClose={() => {
          displayPrivacy.value = false;
        }}
      >
        <div
          className="w-full mx-auto pb-10"
          dangerouslySetInnerHTML={{ __html: privacy.content }}
        />
      </Modal>

      <Modal
        title={cookies.title}
        loading="lazy"
        mode={isMobile() ? "sidebar-bottom" : "center"}
        className="w-full h-[95%] top-auto md:top-0 md:h-full overflow-hidden max-w-none max-h-none md:max-w-[792px] 
        md:max-h-[628px] rounded-[40px] shadow-[0_0_12_0_rgba(0,0,0,0.2)] scrollbar-light pr-4 
        md:pr-[9px] pl-0 pt-16 pb-8"
        open={displayCookies.value}
        onClose={() => {
          displayCookies.value = false;
        }}
      >
        <div
          className="w-full mx-auto pb-10"
          dangerouslySetInnerHTML={{ __html: cookies.content }}
        />
      </Modal>
    </>
  );
}
