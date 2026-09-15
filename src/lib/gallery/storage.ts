import "server-only";

import {
  uploadCmsFile,
  deleteCmsFile,
  deleteCmsFiles,
  signCmsFileUrl,
  signCmsFileUrls,
} from "@/lib/storage/cms";

const BUCKET = "gallery";

const EXTENSION_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

/** Every album's cover image and gallery images live under gallery/{albumId}/. */
export async function uploadGalleryCoverImage(albumId: string, file: File) {
  return uploadCmsFile(BUCKET, file, EXTENSION_BY_MIME, { pathPrefix: albumId });
}

export async function uploadGalleryImage(albumId: string, file: File) {
  return uploadCmsFile(BUCKET, file, EXTENSION_BY_MIME, { pathPrefix: albumId });
}

export async function deleteGalleryFile(path: string | null): Promise<void> {
  return deleteCmsFile(BUCKET, path);
}

export async function deleteGalleryFiles(paths: (string | null)[]): Promise<void> {
  return deleteCmsFiles(BUCKET, paths);
}

export async function signGalleryFileUrl(path: string | null, expiresIn = 3600): Promise<string | null> {
  return signCmsFileUrl(BUCKET, path, expiresIn);
}

export async function signGalleryFileUrls(
  paths: (string | null)[],
  expiresIn = 3600
): Promise<(string | null)[]> {
  return signCmsFileUrls(BUCKET, paths, expiresIn);
}
