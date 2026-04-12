import { getAuthSession } from "../auth/session.js";

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "";
const API_BASE_URL = rawBaseUrl.replace(/\/$/, "");

function buildUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  if (!path.startsWith("/")) {
    return `${API_BASE_URL}/${path}`;
  }

  return `${API_BASE_URL}${path}`;
}

function getAuthHeader(): Headers {
  const headers = new Headers();
  const session = getAuthSession();

  if (!session?.accessToken) {
    throw new Error("Authentication required for upload.");
  }

  headers.set("Authorization", `Bearer ${session.accessToken}`);
  return headers;
}

type UploadResponse = {
  data?: {
    urls?: string[];
    documentUrl?: string;
    selfieWithDocumentUrl?: string;
  };
};

async function postFiles(path: string, files: File[]): Promise<string[]> {
  const formData = new FormData();

  for (const file of files) {
    formData.append("files", file);
  }

  const response = await fetch(buildUrl(path), {
    method: "POST",
    headers: getAuthHeader(),
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.status}`);
  }

  const payload = (await response.json()) as UploadResponse;
  return Array.isArray(payload.data?.urls) ? payload.data.urls : [];
}

export async function uploadProfileImages(files: File[]): Promise<string[]> {
  return postFiles("/user/upload/images", files);
}

export async function uploadProfileVideos(files: File[]): Promise<string[]> {
  return postFiles("/user/upload/videos", files);
}

export async function uploadProfileStories(files: File[]): Promise<string[]> {
  return postFiles("/user/upload/stories", files);
}

export async function uploadVerificationFiles(input: {
  document?: File;
  selfieWithDocument?: File;
}): Promise<{ documentUrl?: string; selfieWithDocumentUrl?: string }> {
  const formData = new FormData();

  if (input.document) {
    formData.append("document", input.document);
  }

  if (input.selfieWithDocument) {
    formData.append("selfieWithDocument", input.selfieWithDocument);
  }

  const response = await fetch(buildUrl("/user/upload/verification"), {
    method: "POST",
    headers: getAuthHeader(),
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.status}`);
  }

  const payload = (await response.json()) as UploadResponse;

  return {
    documentUrl: payload.data?.documentUrl,
    selfieWithDocumentUrl: payload.data?.selfieWithDocumentUrl,
  };
}
