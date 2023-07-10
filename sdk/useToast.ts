import { signal } from "@preact/signals";

const displayToast = signal(false);
const toastContent = signal("");

const state = {
  displayToast,
  toastContent,
};

export const useToast = () => state;
