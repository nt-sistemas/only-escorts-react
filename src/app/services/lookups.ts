import { apiGet } from "../lib/api.js";
import { getAuthSession } from "../auth/session.js";

type ApiNamedEntity = {
  id?: string;
  name?: string;
};

type ApiNamedEntityResponse = ApiNamedEntity[] | { data: ApiNamedEntity[] };

async function fetchNamedEntityList(paths: string[]): Promise<string[]> {
  for (const path of paths) {
    try {
      const response = await apiGet<ApiNamedEntityResponse>(path);
      const source = Array.isArray(response) ? response : response.data;

      const names = source
        .map((item) => (typeof item.name === "string" ? item.name.trim() : ""))
        .filter(Boolean);

      if (names.length > 0) {
        return Array.from(new Set(names));
      }
    } catch {
      // Try the next endpoint candidate.
    }
  }

  return [];
}

export async function listGenderOptions(): Promise<string[]> {
  const hasAccessToken = Boolean(getAuthSession()?.accessToken);

  return fetchNamedEntityList([
    ...(hasAccessToken ? ["/user/gender"] : []),
    "/get-genders",
  ]);
}

export async function listCategoryOptions(): Promise<string[]> {
  const hasAccessToken = Boolean(getAuthSession()?.accessToken);

  return fetchNamedEntityList([
    ...(hasAccessToken ? ["/user/category"] : []),
    "/get-categories",
  ]);
}
