export interface CompanyForm {
  id?: string;
  name: string;
  about: string;
  logo: string;
  banner: string;
  website: string | null;
  email: string | null;
  instagram: string | null;
  employees: string;
  capital: string;
  segment: string;
  companyStage: string;
  [key: string]: string | number | null | undefined;
}
