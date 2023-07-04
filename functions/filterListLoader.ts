import type { LoaderFunction } from "$live/types.ts";
import type { FilterList } from "deco-sites/madeinbrazil/routes/api/companies.ts";
import { companies } from "../routes/api/companies.ts";

/**
 * @title filter List Loader
 * @description Gets filters from company information
 */
const filterListLoader: LoaderFunction<null, FilterList[]> = async (
  _req,
  _ctx,
) => {
  await companies.getFilters();

  return {
    data: companies.filterList,
  };
};

export default filterListLoader;
