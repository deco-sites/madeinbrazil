import { signal } from "@preact/signals";

const displayFormModal = signal(false);

const state = {
  displayFormModal,
};

export const useFormModal = () => state;
