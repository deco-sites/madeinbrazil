import type { LoaderContext } from "$live/types.ts";
import type { Company } from "deco-sites/madeinbrazil/routes/api/companies.ts";
import { fetchCompanies } from "../routes/api/companies.ts";

export interface Props {
  /** @description likesThreshold */
  likesThreshold?: number;
}

/**
 * @title Company List Loader
 * @description Gets company information
 */
const companies = async (
  _req: Request,
  _ctx: LoaderContext,
  {
    likesThreshold = 0,
  }: Props,
): Promise<Company[]> => {
  const { companyList } = await fetchCompanies(
    "companyUpvotes",
    null,
    null,
    null,
    null,
    likesThreshold,
  );

  return companyList;
};

export default companies;
