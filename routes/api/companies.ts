import { Handlers } from "$fresh/server.ts";

const AUTH_TOKEN =
  "patqPStV56SAyWPdL.b8ee254879699e0c7cd3cb4c9fd128d52b2bf5d99eccd89cf5b1b6c7dd594ee1";
const AIRTABLE_URL =
  "https://api.airtable.com/v0/appUFpUsqerCzZAct/tblP1U9nfrENiiTiB";

const IMAGEHOST_URL = "https://api.imgbb.com/1/upload";
const IMAGEHOST_SECRET = "41133002c150ada5e529a603f86c9115";

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
  likesThreshold: number,
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

  const defaultFilters =
    `{companyUpvotes} >= ${likesThreshold}, {approved} = 1`;

  const filters = {
    employees: parseFilter(employees, "employees"),
    companyStage: parseFilter(companyStage, "companyStage"),
    capital: parseFilter(capital, "capital"),
    segment: parseFilter(segment, "segment"),
  };

  const filtersFormatted = Object.values(filters).filter((f) => f).join(",");

  const filterByFormula = filtersFormatted.length > 0
    ? (
      `AND(${filtersFormatted}, ${defaultFilters})`
    )
    : (`AND(${defaultFilters})`);

  const params = new URLSearchParams({
    "maxRecords": "100",
    "sort[0][field]": orderBy,
    "sort[0][direction]": "desc",
  });

  if (filterByFormula) {
    console.log(filterByFormula);

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
      const filters: FilterListSet = data.records.reduce<FilterListSet>(
        (acc, record) => {
          const { fields } = record;
          acc.employees.values.add(fields.employees.trimStart().trimEnd());
          acc.companyStage.values.add(
            fields.companyStage.trimStart().trimEnd(),
          );
          acc.capital.values.add(fields.capital.trimStart().trimEnd());
          acc.segment.values.add(fields.segment.trimStart().trimEnd());

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

      const rangeValues: {
        [key: string]: number;
      } = {
        "Self-employed": 0,
        "1-10 employees": 1,
        "11-50 employees": 2,
        "51-200 employees": 3,
        "201-500 employees": 4,
        "501-1000 employees": 5,
        "1001-5000 employees": 6,
        "5001-10,000 employees": 7,
        "10,001+ employees": 8,
      };

      const filterList = Object.entries(filters).map(
        ([key, value]) => {
          return {
            name: key,
            label: value.name,
            values: key === "employees"
              ? Array.from(value.values).sort((a, b) =>
                rangeValues[a] - rangeValues[b]
              )
              : Array.from(value.values).sort(),
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

  const body = JSON.stringify({
    fields: record,
  });

  const url = `${AIRTABLE_URL}/${recordId}`;

  return await fetch(url, {
    method,
    headers: myHeaders,
    body,
  })
    .then((response) => response.json())
    .then((data: AirtableUpdateResponse) => {
      return data;
    })
    .catch((error) => {
      console.error(error);
      throw new Error(error);
    });
};

interface FreeImageHostResponse {
  success: {
    code: number;
    message: string;
  };
  data: {
    url: string;
  };
}

const uploadImageToHost = async (image: string) => {
  const formData = new FormData();

  const imageSplit = image.split(",").pop();

  if (!imageSplit) {
    return null;
  }

  formData.append("image", imageSplit);

  return await fetch(
    `${IMAGEHOST_URL}?key=${IMAGEHOST_SECRET}`,
    {
      method: "POST",
      body: formData,
    },
  )
    .then((response) => response.json())
    .then((res: FreeImageHostResponse) => {
      console.log(res);
      return res.data.url;
    })
    .catch((error) => {
      console.error(error);
    });
};

export interface CreateCompanyRequest {
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

const addCompany = async (record: CreateCompanyRequest) => {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${AUTH_TOKEN}`);
  myHeaders.append("Content-Type", "application/json");

  const logo = record.logo && await uploadImageToHost(record.logo);
  const banner = record.banner && await uploadImageToHost(record.banner);

  const body = JSON.stringify({
    fields: {
      ...record,
      logo: [
        {
          url: logo,
        },
      ],
      banner: [
        {
          url: banner,
        },
      ],
      approved: false,
      companyUpvotes: 0,
    },
  });

  return await fetch(AIRTABLE_URL, {
    method: "POST",
    headers: myHeaders,
    body,
  })
    .then((response) => response.json())
    .then((data: AirtableUpdateResponse) => {
      return data;
    })
    .catch((error) => {
      console.error(error);
      throw new Error(error);
    });
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
    likesThreshold: number,
  ) => Promise<Company[]>;
  getFilters: () => Promise<FilterList[]>;
  update: (s: Company) => Promise<AirtableUpdateResponse>;
  add: (s: CreateCompanyRequest) => Promise<void>;
} = {
  list: [],
  filterList: [] as FilterList[],
  getList: async function (
    orderBy: string,
    employees: string | null,
    companyStage: string | null,
    capital: string | null,
    segment: string | null,
    likesThreshold: number,
  ) {
    this.list = (await fetchCompanies(
      orderBy,
      employees,
      companyStage,
      capital,
      segment,
      likesThreshold,
    )) as Company[];
    return this.list;
  },
  getFilters: async function () {
    this.filterList = await fetchFilters();

    return this.filterList;
  },
  update: async function (company) {
    const response = await updateCompany(company, "PATCH");

    return response;
  },
  add: async function (company) {
    await addCompany(company);
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
    const likesThreshold = Number(queryParameters.get("likesThreshold")) ?? 0;

    await companies.getList(
      orderBy,
      employees,
      companyStage,
      capital,
      segment,
      likesThreshold,
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
    const body = await parseBody<CreateCompanyRequest>(req.body);

    if (!body) {
      return new Response("Insert a correct body", {
        status: 400,
      });
    }

    companies.add(body);

    const status = 200;

    return new Response(
      JSON.stringify({
        status,
        data: body,
      }),
      {
        status,
      },
    );
  },

  async PATCH(req) {
    const body = await parseBody<Company>(req.body);

    console.log(body);

    if (!body) {
      return new Response("Insert a correct body", {
        status: 400,
      });
    }

    const companiesResponse = await companies.update(body);

    const status = 200;

    return new Response(
      JSON.stringify({
        status,
        data: companiesResponse.fields,
      }),
      {
        status,
      },
    );
  },
};

interface FilterListSetValue {
  name: string;
  values: Set<string>;
}

export interface FilterListSet {
  [key: string]: FilterListSetValue;
  employees: FilterListSetValue;
  companyStage: FilterListSetValue;
  capital: FilterListSetValue;
  segment: FilterListSetValue;
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

interface AirtableUpdateResponse {
  id: string;
  fields: CompanyDB;
  createdTime: string;
}

export interface Company {
  id?: string;
  name: string;
  approved: boolean;
  about: string;
  logo: AirtableAttachment[];
  banner: AirtableAttachment[];
  website: string | null;
  email: string | null;
  instagram: string | null;
  employees: string;
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
  approved: boolean;
  about: string;
  logo: AirtableAttachment[];
  banner: AirtableAttachment[];
  website: string | null;
  email: string | null;
  instagram: string | null;
  employees: string;
  capital: string;
  segment: string;
  companyStage: string;
  companyUpvotes: number;
}
