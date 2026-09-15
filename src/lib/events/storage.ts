import "server-only";

import { uploadCmsFile, deleteCmsFile, signCmsFileUrl, signCmsFileUrls } from "@/lib/storage/cms";

const BUCKET = "events";
const EXTENSION_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function uploadEventImage(file: File) {
  return uploadCmsFile(BUCKET, file, EXTENSION_BY_MIME);
}

export async function deleteEventImage(path: string | null) {
  return deleteCmsFile(BUCKET, path);
}

export async function signEventImageUrl(path: string | null) {
  return signCmsFileUrl(BUCKET, path);
}

export async function signEventImageUrls(paths: (string | null)[]) {
  return signCmsFileUrls(BUCKET, paths);
}
