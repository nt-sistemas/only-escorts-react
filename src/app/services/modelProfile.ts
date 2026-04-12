import { apiGet, apiPost } from "../lib/api.js";

export type ProfileTestimonial = {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
};

export type ProfileModelData = {
  id: string;
  name: string;
  age?: number;
  city?: string;
  category?: string;
  gender?: string;
  image: string;
  price?: string;
  verified: boolean;
  rating: number;
  reviews: number;
  phone?: string;
  email?: string;
  description?: string;
  services: string[];
  availability?: string;
  languages: string[];
  gallery: string[];
  videos: string[];
  testimonials: ProfileTestimonial[];
};

type ApiProfile = Partial<ProfileModelData> & {
  price?: number | string;
};

type ApiProfileResponse = ApiProfile | { data: ApiProfile };

type CreateTestimonialPayload = {
  comment: string;
  rating: number;
  author?: string;
  email?: string;
};

type ApiTestimonial = Partial<ProfileTestimonial> & {
  id?: number | string;
  comment?: string;
  rating?: number;
  author?: string;
  date?: string;
  createdAt?: string;
  created_at?: string;
};

type CreateTestimonialResponse = ApiTestimonial | { data: ApiTestimonial };

function formatEuroPerHour(price: number | string | undefined) {
  if (typeof price === "string") {
    return price.includes("€") ? price : `€ ${price}`;
  }

  if (typeof price === "number") {
    return `€ ${new Intl.NumberFormat("de-DE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price)}/h`;
  }

  return "€ 0,00/h";
}

export async function getModelProfileById(
  modelId: string,
): Promise<Partial<ProfileModelData>> {
  const response = await apiGet<ApiProfileResponse>(`/models/${modelId}`);
  const data = "data" in response ? response.data : response;

  return {
    ...(typeof data.id === "string" ? { id: data.id } : {}),
    ...(data.name ? { name: data.name } : {}),
    ...(typeof data.age === "number" ? { age: data.age } : {}),
    ...(data.city ? { city: data.city } : {}),
    ...(data.category ? { category: data.category } : {}),
    ...(data.gender ? { gender: data.gender } : {}),
    ...(data.image ? { image: data.image } : {}),
    ...(typeof data.price !== "undefined"
      ? { price: formatEuroPerHour(data.price) }
      : {}),
    ...(typeof data.verified === "boolean" ? { verified: data.verified } : {}),
    ...(typeof data.rating === "number" ? { rating: data.rating } : {}),
    ...(typeof data.reviews === "number" ? { reviews: data.reviews } : {}),
    ...(data.phone ? { phone: data.phone } : {}),
    ...(data.email ? { email: data.email } : {}),
    ...(data.description ? { description: data.description } : {}),
    ...(Array.isArray(data.services) ? { services: data.services } : {}),
    ...(data.availability ? { availability: data.availability } : {}),
    ...(Array.isArray(data.languages) ? { languages: data.languages } : {}),
    ...(Array.isArray(data.gallery) ? { gallery: data.gallery } : {}),
    ...(Array.isArray(data.videos) ? { videos: data.videos } : {}),
    ...(Array.isArray(data.testimonials)
      ? { testimonials: data.testimonials }
      : {}),
  };
}

export async function createModelTestimonial(
  profileId: string,
  payload: CreateTestimonialPayload,
): Promise<ProfileTestimonial> {
  const response = await apiPost<
    CreateTestimonialResponse,
    CreateTestimonialPayload
  >(`/create-testimonial/${profileId}`, payload);
  const source = "data" in response ? response.data : response;

  const generatedId =
    globalThis.crypto && typeof globalThis.crypto.randomUUID === "function"
      ? globalThis.crypto.randomUUID()
      : "00000000-0000-4000-8000-000000000000";
  const rating =
    typeof source.rating === "number"
      ? Math.min(Math.max(Math.round(source.rating), 1), 5)
      : Math.min(Math.max(Math.round(payload.rating), 1), 5);

  return {
    id: typeof source.id === "string" ? source.id : generatedId,
    author: source.author || payload.author || "Anonymous",
    rating,
    date:
      source.date ||
      source.createdAt ||
      source.created_at ||
      new Date().toLocaleDateString("en-GB"),
    comment: source.comment || payload.comment,
  };
}
