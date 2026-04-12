import { apiGet } from "../lib/api.js";
import { getAuthSession } from "../auth/session.js";

const LOOKUPS_DEBUG = import.meta.env.VITE_LOOKUPS_DEBUG === "true";

type ApiNamedEntity = {
  id?: string;
  name?: string;
};

type ApiNamedEntityResponse = ApiNamedEntity[] | { data: ApiNamedEntity[] };

async function fetchNamedEntityList(paths: string[]): Promise<string[]> {
  for (const path of paths) {
    try {
      if (LOOKUPS_DEBUG) {
        console.info(`[lookups] trying endpoint: ${path}`);
      }

      const response = await apiGet<ApiNamedEntityResponse>(path);
      const source = Array.isArray(response) ? response : response.data;

      const names = source
        .map((item) => (typeof item.name === "string" ? item.name.trim() : ""))
        .filter(Boolean);

      if (names.length > 0) {
        if (LOOKUPS_DEBUG) {
          console.info(
            `[lookups] endpoint succeeded: ${path} (${names.length} option(s))`,
          );
        }

        return Array.from(new Set(names));
      }

      if (LOOKUPS_DEBUG) {
        console.info(`[lookups] endpoint returned no options: ${path}`);
      }
    } catch {
      if (LOOKUPS_DEBUG) {
        console.warn(`[lookups] endpoint failed: ${path}`);
      }

      // Try the next endpoint candidate.
    }
  }

  if (LOOKUPS_DEBUG) {
    console.warn("[lookups] no lookup endpoint returned options.");
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
