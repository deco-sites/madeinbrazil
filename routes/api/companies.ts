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
  employees: number | null,
  companyStage: string | null,
  capital: string | null,
  segment: string | null,
) => {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${AUTH_TOKEN}`);

  const filters = {
    employees: employees && `{employees} >= ${employees}`,
    companyStage: companyStage && `{companyStage} = "${companyStage}"`,
    capital: capital && `{capital} = "${capital}"`,
    segment: segment && `{segment} = "${segment}"`,
  };

  const filterByFormula = Object.entries(filters)
    .filter(([_, value]) => value)
    .map(([_, value]) => value)
    .join(" AND ");

  const params = new URLSearchParams({
    maxRecords: "100",
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
  getList: (
    orderBy: string,
    employees: number | null,
    companyStage: string | null,
    capital: string | null,
    segment: string | null,
  ) => Promise<Company[]>;
  update: (s: Company) => Promise<void>;
  add: (s: Company) => Promise<void>;
} = {
  list: [],
  getList: async function (
    orderBy: string,
    employees: number | null,
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
  update: async function (company) {
    await updateCompany(company, "PATCH");
  },
  add: async function (company) {
    await updateCompany(company, "POST");
  },
};

export const handler: Handlers = {
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

interface AirTableListResponse {
  records: Record[];
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
