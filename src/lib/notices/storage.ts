import "server-only";

import { uploadCmsFile, deleteCmsFile, signCmsFileUrl, signCmsFileUrls } from "@/lib/storage/cms";

const BUCKET = "documents";
const PATH_PREFIX = "notices";
const EXTENSION_BY_MIME: Record<string, string> = {
  "application/pdf": "pdf",
  "image/jpeg": "jpg",
  "image/png": "png",
};

export async function uploadNoticeAttachment(file: File) {
  return uploadCmsFile(BUCKET, file, EXTENSION_BY_MIME, { pathPrefix: PATH_PREFIX });
}

export async function deleteNoticeAttachment(path: string | null) {
  return deleteCmsFile(BUCKET, path);
}

export async function signNoticeAttachmentUrl(path: string | null) {
  return signCmsFileUrl(BUCKET, path);
}

export async function signNoticeAttachmentUrls(paths: (string | null)[]) {
  return signCmsFileUrls(BUCKET, paths);
}
