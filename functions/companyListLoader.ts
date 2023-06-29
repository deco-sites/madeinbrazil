import type { LoaderFunction } from "$live/types.ts";
import type { Company } from "deco-sites/madeinbraziltec/routes/api/companies.ts";
import { companies } from "../routes/api/companies.ts";

export interface Props {
  /** @description order of items */
  orderBy: string;
  /** @description number of employees */
  employees?: number;
  /** @description company stage */
  companyStage?: string;
  /** @description capital */
  capital?: string;
  /** @description segment */
  segment?: string;
}

/**
 * @title Company List Loader
 * @description Gets company information
 */
const companyListLoader: LoaderFunction<Props, Company[]> = async (
  _req,
  _ctx,
  {
    orderBy = "createdTime",
    employees = null,
    companyStage = null,
    capital = null,
    segment = null,
  },
) => {
  await companies.getList(
    orderBy,
    employees,
    companyStage,
    capital,
    segment,
  );

  return {
    data: companies.list,
  };
};

export default companyListLoader;