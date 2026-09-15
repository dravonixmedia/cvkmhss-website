import "server-only";

import { uploadCmsFile, deleteCmsFile, signCmsFileUrl, signCmsFileUrls } from "@/lib/storage/cms";

const BUCKET = "news";
const EXTENSION_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function uploadNewsImage(file: File) {
  return uploadCmsFile(BUCKET, file, EXTENSION_BY_MIME);
}

export async function deleteNewsImage(path: string | null) {
  return deleteCmsFile(BUCKET, path);
}

export async function signNewsImageUrl(path: string | null) {
  return signCmsFileUrl(BUCKET, path);
}

export async function signNewsImageUrls(paths: (string | null)[]) {
  return signCmsFileUrls(BUCKET, paths);
}
