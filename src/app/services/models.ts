import { apiGet } from "../lib/api.js";
import type { Story } from "../components/stories/index.js";

export type CatalogModel = {
  id: string;
  name: string;
  age?: number;
  city?: string;
  category?: string;
  gender?: string;
  image: string;
  price?: string;
  verified: boolean;
  gallery?: string[];
  videos?: string[];
  testimonials?: {
    id: string;
    author: string;
    comment: string;
    rating: number;
  }[];
};

type ApiModel = {
  id: number | string;
  name: string;
  age?: number;
  city?: string;
  category?: string;
  gender?: string;
  image?: string;
  price?: number | string;
  verified?: boolean;
  gallery?: string[];
  videos?: string[];
  testimonials?: Array<{
    id?: number | string;
    author?: string;
    comment?: string;
    rating?: number;
  }>;
};

type ApiModelsResponse = ApiModel[] | { data: ApiModel[] };

type ApiStorySlide = {
  id?: string;
  image?: string;
  duration?: number;
};

type ApiStory = {
  id?: string;
  userId?: string;
  userName?: string;
  userImage?: string;
  viewed?: boolean;
  slides?: ApiStorySlide[];
};

type ApiStoriesResponse = ApiStory[] | { data: ApiStory[] };
type ApiNamedEntity = { id?: string; name?: string };
type ApiNamedEntityResponse = ApiNamedEntity[] | { data: ApiNamedEntity[] };
type ApiCity = { city?: string; count?: number };
type ApiCityResponse = ApiCity[] | { data: ApiCity[] };

function formatEuroPerHour(price: ApiModel["price"]) {
  if (typeof price === "string") {
    if (price.includes("€")) {
      return price;
    }

    const asNumber = Number(price.replace(",", "."));
    if (Number.isFinite(asNumber)) {
      return `€ ${new Intl.NumberFormat("de-DE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(asNumber)}/h`;
    }

    return "€ 0,00/h";
  }

  if (typeof price === "number") {
    return `€ ${new Intl.NumberFormat("de-DE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price)}/h`;
  }

  return "€ 0,00/h";
}

function normalizeModel(model: ApiModel): CatalogModel | null {
  if (typeof model.id !== "string" || model.id.trim().length === 0) {
    return null;
  }

  const normalizedTestimonials = Array.isArray(model.testimonials)
    ? model.testimonials
        .map((testimonial) => {
          const testimonialId =
            typeof testimonial.id === "string" &&
            testimonial.id.trim().length > 0
              ? testimonial.id
              : null;

          if (!testimonialId) {
            return null;
          }

          return {
            id: testimonialId,
            author: testimonial.author || "Anonymous",
            comment: testimonial.comment || "",
            rating:
              typeof testimonial.rating === "number"
                ? Math.min(Math.max(Math.round(testimonial.rating), 1), 5)
                : 5,
          };
        })
        .filter((testimonial): testimonial is NonNullable<typeof testimonial> =>
          Boolean(testimonial && testimonial.comment.length > 0),
        )
    : [];

  return {
    id: model.id,
    name: model.name || "Unknown",
    ...(typeof model.age === "number" ? { age: model.age } : {}),
    ...(model.city ? { city: model.city } : {}),
    ...(model.category ? { category: model.category } : {}),
    ...(model.gender ? { gender: model.gender } : {}),
    image: model.image || "",
    ...(typeof model.price !== "undefined"
      ? { price: formatEuroPerHour(model.price) }
      : {}),
    verified: Boolean(model.verified),
    gallery: model.gallery ?? [],
    videos: Array.isArray(model.videos) ? model.videos : [],
    testimonials: normalizedTestimonials,
  };
}

export async function listModels(): Promise<CatalogModel[]> {
  const response = await apiGet<ApiModelsResponse>("/models");
  const source = Array.isArray(response) ? response : response.data;

  return source
    .map(normalizeModel)
    .filter((model): model is CatalogModel => Boolean(model))
    .filter((model: CatalogModel) => Boolean(model.image));
}

function normalizeNamedEntityList(response: ApiNamedEntityResponse): string[] {
  const source = Array.isArray(response) ? response : response.data;

  return Array.from(
    new Set(
      source
        .map((item) => (typeof item.name === "string" ? item.name.trim() : ""))
        .filter(Boolean),
    ),
  );
}

export async function listModelGenders(): Promise<string[]> {
  const response = await apiGet<ApiNamedEntityResponse>("/get-genders");
  return normalizeNamedEntityList(response);
}

export async function listModelCategories(): Promise<string[]> {
  const response = await apiGet<ApiNamedEntityResponse>("/get-categories");
  return normalizeNamedEntityList(response);
}

export async function listModelCities(): Promise<string[]> {
  const response = await apiGet<ApiCityResponse>("/get-cities");
  const source = Array.isArray(response) ? response : response.data;

  return Array.from(
    new Set(
      source
        .map((item) => (typeof item.city === "string" ? item.city.trim() : ""))
        .filter(Boolean),
    ),
  );
}

export async function listModelStories(): Promise<Story[]> {
  const response = await apiGet<ApiStoriesResponse>("/models/stories");
  const source = Array.isArray(response) ? response : response.data;

  return source
    .map((story) => {
      if (
        typeof story.id !== "string" ||
        typeof story.userId !== "string" ||
        typeof story.userName !== "string" ||
        typeof story.userImage !== "string"
      ) {
        return null;
      }

      const slides = Array.isArray(story.slides)
        ? story.slides
            .map((slide) => {
              if (
                typeof slide.id !== "string" ||
                typeof slide.image !== "string"
              ) {
                return null;
              }

              return {
                id: slide.id,
                image: slide.image,
                duration:
                  typeof slide.duration === "number" ? slide.duration : 5000,
              };
            })
            .filter((slide): slide is NonNullable<typeof slide> =>
              Boolean(slide),
            )
        : [];

      if (slides.length === 0) {
        return null;
      }

      return {
        id: story.id,
        userId: story.userId,
        userName: story.userName,
        userImage: story.userImage,
        viewed: Boolean(story.viewed),
        slides,
      };
    })
    .filter((story): story is Story => Boolean(story));
}

export async function getModelStoryByProfileId(
  profileId: string,
): Promise<Story> {
  const response = await apiGet<ApiStory | { data: ApiStory }>(
    `/models/stories/${profileId}`,
  );

  const story = "data" in response ? response.data : response;

  if (
    typeof story.id !== "string" ||
    typeof story.userId !== "string" ||
    typeof story.userName !== "string" ||
    typeof story.userImage !== "string"
  ) {
    throw new Error("Invalid story payload");
  }

  const slides = Array.isArray(story.slides)
    ? story.slides
        .map((slide) => {
          if (typeof slide.id !== "string" || typeof slide.image !== "string") {
            return null;
          }

          return {
            id: slide.id,
            image: slide.image,
            duration:
              typeof slide.duration === "number" ? slide.duration : 5000,
          };
        })
        .filter((slide): slide is NonNullable<typeof slide> => Boolean(slide))
    : [];

  if (slides.length === 0) {
    throw new Error("Story has no slides");
  }

  return {
    id: story.id,
    userId: story.userId,
    userName: story.userName,
    userImage: story.userImage,
    viewed: Boolean(story.viewed),
    slides,
  };
}
