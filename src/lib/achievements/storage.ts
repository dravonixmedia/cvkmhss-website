import "server-only";

import { uploadCmsFile, deleteCmsFile, signCmsFileUrl, signCmsFileUrls } from "@/lib/storage/cms";

const BUCKET = "achievements";
const EXTENSION_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function uploadAchievementImage(file: File) {
  return uploadCmsFile(BUCKET, file, EXTENSION_BY_MIME);
}

export async function deleteAchievementImage(path: string | null) {
  return deleteCmsFile(BUCKET, path);
}

export async function signAchievementImageUrl(path: string | null) {
  return signCmsFileUrl(BUCKET, path);
}

export async function signAchievementImageUrls(paths: (string | null)[]) {
  return signCmsFileUrls(BUCKET, paths);
}
