import type { LoaderFunction } from "$live/types.ts";
import type { Company } from "deco-sites/madeinbrazil/routes/api/companies.ts";
import { companies } from "../routes/api/companies.ts";

export interface Props {
  /** @description order of items */
  orderBy: string;
  /** @description number of employees */
  employees?: string;
  /** @description company stage */
  companyStage?: string;
  /** @description capital */
  capital?: string;
  /** @description segment */
  segment?: string;
  /** @description likesThreshold */
  likesThreshold?: number;
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
    likesThreshold = 0,
  },
) => {
  await companies.getList(
    orderBy,
    employees,
    companyStage,
    capital,
    segment,
    likesThreshold,
  );

  return {
    data: companies.list,
  };
};

export default companyListLoader;
