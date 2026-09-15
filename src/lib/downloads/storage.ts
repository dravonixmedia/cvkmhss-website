import "server-only";

import { uploadCmsFile, deleteCmsFile, signCmsFileUrl, signCmsFileUrls } from "@/lib/storage/cms";

const BUCKET = "documents";
const PATH_PREFIX = "downloads";
const EXTENSION_BY_MIME: Record<string, string> = {
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/vnd.ms-excel": "xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "image/jpeg": "jpg",
  "image/png": "png",
};

export async function uploadDownloadDocument(file: File) {
  return uploadCmsFile(BUCKET, file, EXTENSION_BY_MIME, { pathPrefix: PATH_PREFIX });
}

export async function deleteDownloadDocument(path: string | null) {
  return deleteCmsFile(BUCKET, path);
}

export async function signDownloadDocumentUrl(path: string | null) {
  return signCmsFileUrl(BUCKET, path);
}

export async function signDownloadDocumentUrls(paths: (string | null)[]) {
  return signCmsFileUrls(BUCKET, paths);
}
