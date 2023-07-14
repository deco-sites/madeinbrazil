import { signal } from "@preact/signals";

import { OrderBy } from "../types/orderBy.ts";

const orderBy = signal(OrderBy.MOST_POPULAR);

const state = {
  orderBy,
};

export const useOrderBy = () => state;
