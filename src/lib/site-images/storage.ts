import "server-only";

import { uploadCmsFile, deleteCmsFile, signCmsFileUrl, signCmsFileUrls } from "@/lib/storage/cms";

const BUCKET = "site-images";
const EXTENSION_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function uploadSiteImage(file: File) {
  return uploadCmsFile(BUCKET, file, EXTENSION_BY_MIME);
}

export async function deleteSiteImage(path: string | null) {
  return deleteCmsFile(BUCKET, path);
}

export async function signSiteImageUrl(path: string | null) {
  return signCmsFileUrl(BUCKET, path);
}

export async function signSiteImageUrls(paths: (string | null)[]) {
  return signCmsFileUrls(BUCKET, paths);
}
