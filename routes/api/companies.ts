import { Handlers } from "$fresh/server.ts";
import { DOMParser } from "deno-dom";

const AUTH_TOKEN =
  "patqPStV56SAyWPdL.b8ee254879699e0c7cd3cb4c9fd128d52b2bf5d99eccd89cf5b1b6c7dd594ee1";
const AIRTABLE_URL =
  "https://api.airtable.com/v0/appUFpUsqerCzZAct/tblP1U9nfrENiiTiB";

const parseBody = async <T>(
  body: ReadableStream<Uint8Array> | null,
): Promise<T | null> => {
  if (body === null) {
    return null;
  }

  const reader = body.getReader();
  const decoder = new TextDecoder();
  let decodedData = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    decodedData += decoder.decode(value, { stream: true });
  }

  return JSON.parse(decodedData) as T;
};

const fetchCompanies = async (
  orderBy: string,
  employees: string | null,
  companyStage: string | null,
  capital: string | null,
  segment: string | null,
) => {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${AUTH_TOKEN}`);

  const parseFilter = (filter: string | null, filterName: string) => {
    if (!filter) return null;

    const filterValues = filter.split(",").map((value) => value.trim());
    const filterConditions = filterValues.map((value) =>
      `{${filterName}} = "${value}"`
    );
    const filterFormula = `OR(${filterConditions.join(", ")})`;

    return filterFormula;
  };

  const filters = {
    employees: parseFilter(employees, "employees"),
    companyStage: parseFilter(companyStage, "companyStage"),
    capital: parseFilter(capital, "capital"),
    segment: parseFilter(segment, "segment"),
  };

  const filterByFormula = `AND(${
    Object.values(filters).filter((f) => f).join(",")
  })`;

  const params = new URLSearchParams({
    "maxRecords": "100",
    "sort[0][field]": orderBy,
    "sort[0][direction]": "desc",
  });

  if (filterByFormula) {
    params.append("filterByFormula", filterByFormula);
  }

  return await fetch(`${AIRTABLE_URL}?${params.toString()}`, {
    method: "GET",
    headers: myHeaders,
  })
    .then((response) => response.json())
    .then((data: AirTableListResponse) => {
      return data.records.map(toCompany);
    })
    .catch((error) => {
      console.error(error);
      throw new Error(error);
    });
};

const fetchFilters = async () => {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${AUTH_TOKEN}`);

  const filterList = [
    "employees",
    "companyStage",
    "capital",
    "segment",
  ];

  const filtersQuery = filterList.map((filter, index) => {
    if (index === 0) {
      return `fields[]=${filter}`;
    } else {
      return `&fields[]=${filter}`;
    }
  });

  return await fetch(`${AIRTABLE_URL}?${encodeURI(filtersQuery.join(""))}`, {
    method: "GET",
    headers: myHeaders,
  })
    .then((response) => response.json())
    .then((data: AirTableListResponse) => {
      const filters = data.records.reduce<FilterListSet>(
        (acc, record) => {
          const { fields } = record;
          acc.employees.values.add(fields.employees);
          acc.companyStage.values.add(fields.companyStage);
          acc.capital.values.add(fields.capital);
          acc.segment.values.add(fields.segment);

          return acc;
        },
        {
          employees: {
            name: "Number of Employees",
            values: new Set([]),
          },
          companyStage: {
            name: "Company Stage",
            values: new Set([]),
          },
          capital: {
            name: "Capital",
            values: new Set([]),
          },
          segment: {
            name: "Segment",
            values: new Set([]),
          },
        },
      );

      const filterList = Object.entries(filters).map(
        ([key, value]) => {
          return {
            name: key,
            label: value.name,
            values: Array.from(value.values),
          };
        },
      );

      return filterList as FilterList[];
    })
    .catch((error) => {
      console.error(error);
      throw new Error(error);
    });
};

const toCompany = (record: Record): Company => {
  return {
    ...record.fields,
    id: record.id,
  };
};

const updateCompany = async (
  { id: recordId, ...record }: Company,
  method: "POST" | "PATCH",
) => {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${AUTH_TOKEN}`);
  myHeaders.append("Content-Type", "application/json");

  await fetch(`${AIRTABLE_URL}${method === "PATCH" ? `/${recordId!}` : ""}`, {
    method,
    headers: myHeaders,
    body: JSON.stringify({ fields: record }),
  }).catch((error) => {
    throw new Error(error);
  });
};

const normalizeCompany = async (
  company: CompanyDB,
): Promise<Company> => {
  const html = await fetch(encodeURI(company.website)).then((r) => r.text());
  const document = new DOMParser().parseFromString(html, "text/html");

  if (!document) return company as Company;

  const decoState = JSON.parse(
    document.querySelector("#__DECO_STATE")?.textContent ?? "null",
  );

  return {
    ...company,
    logo: decoState?.logo ?? company.logo,
    banner: decoState?.banner ?? company.banner,
    name: decoState?.name ?? company.name,
    about: decoState?.about ?? company.about,
  };
};

export const companies: {
  list: Company[];
  filterList: FilterList[];
  getList: (
    orderBy: string,
    employees: string | null,
    companyStage: string | null,
    capital: string | null,
    segment: string | null,
  ) => Promise<Company[]>;
  getFilters: () => Promise<FilterList[]>;
  update: (s: Company) => Promise<void>;
  add: (s: Company) => Promise<void>;
} = {
  list: [],
  filterList: [] as FilterList[],
  getList: async function (
    orderBy: string,
    employees: string | null,
    companyStage: string | null,
    capital: string | null,
    segment: string | null,
  ) {
    this.list = (await fetchCompanies(
      orderBy,
      employees,
      companyStage,
      capital,
      segment,
    )) as Company[];
    return this.list;
  },
  getFilters: async function () {
    this.filterList = await fetchFilters();

    return this.filterList;
  },
  update: async function (company) {
    await updateCompany(company, "PATCH");
  },
  add: async function (company) {
    await updateCompany(company, "POST");
  },
};

export const handler: Handlers = {
  async GET(req) {
    const queryParameters = new URL(req.url).searchParams;

    const orderBy = queryParameters.get("orderBy") ?? "createdTime";
    const employees = queryParameters.get("employees") ?? null;
    const companyStage = queryParameters.get("companyStage") ?? null;
    const capital = queryParameters.get("capital") ?? null;
    const segment = queryParameters.get("segment") ?? null;

    await companies.getList(
      orderBy,
      employees,
      companyStage,
      capital,
      segment,
    );

    const status = 200;

    return new Response(
      JSON.stringify({
        status,
        data: companies.list,
      }),
      {
        status,
      },
    );
  },

  async POST(req) {
    const body = await parseBody<Company>(req.body);

    if (!body) {
      return new Response("Insert a correct body", {
        status: 400,
      });
    }

    const newCompany = await normalizeCompany(body);

    if (!newCompany) {
      return new Response("Site connection problem", {
        status: 400,
      });
    }

    await companies.add(newCompany);
    const status = 201;

    return new Response(
      JSON.stringify({
        status,
        data: newCompany,
      }),
      {
        status,
      },
    );
  },
};

export interface FilterListSet {
  employees: {
    name: string;
    values: Set<number>;
  };
  companyStage: {
    name: string;
    values: Set<string>;
  };
  capital: {
    name: string;
    values: Set<string>;
  };
  segment: {
    name: string;
    values: Set<string>;
  };
}

export interface FilterList {
  name: string;
  label: string;
  values: string[] | number[];
}

interface AirtableAttachment {
  id: string;
  url: string;
  filename: string;
  size: number;
  type: string;
  thumbnails: {
    small: {
      url: string;
      width: number;
      height: number;
    };
    large: {
      url: string;
      width: number;
      height: number;
    };
    full: {
      url: string;
      width: number;
      height: number;
    };
  };
}

export interface Company {
  id?: string;
  name: string;
  about: string;
  logo: AirtableAttachment[];
  banner: AirtableAttachment[];
  website: string;
  email: string;
  instagram: string;
  employees: number;
  capital: string;
  segment: string;
  companyStage: string;
  companyUpvotes: number;
}

export type CompanyRequest =
  & Pick<
    Company,
    "employees" | "companyStage" | "capital" | "segment"
  >
  & { orderBy: string };

interface AirTableListResponse {
  records: Record[];
  offset: string;
}

interface Record {
  id: string;
  createdTime: string;
  fields: CompanyDB;
}

interface CompanyDB {
  name: string;
  about: string;
  logo: AirtableAttachment[];
  banner: AirtableAttachment[];
  website: string;
  email: string;
  instagram: string;
  employees: number;
  capital: string;
  segment: string;
  companyStage: string;
  companyUpvotes: number;
}
