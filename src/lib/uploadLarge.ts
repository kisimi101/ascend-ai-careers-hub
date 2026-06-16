import { supabase } from "@/integrations/supabase/client";

export const MAX_UPLOAD_BYTES = 50 * 1024 * 1024; // 50 MB

/**
 * Upload a File to the private `uploads` bucket and return the storage path.
 * Streams directly to Supabase Storage so we bypass the 6MB edge-function payload cap.
 * - Authenticated users: stored under `{userId}/{uuid}.{ext}` and readable by that user.
 * - Anonymous users: stored under `guest/{uuid}.{ext}` with short retention (cleaned up server-side).
 */
export async function uploadLarge(file: File): Promise<{ path: string; size: number }> {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error(`File is too large. Maximum is 50MB (got ${(file.size / 1024 / 1024).toFixed(1)}MB).`);
  }

  const { data: { user } } = await supabase.auth.getUser();
  const prefix = user?.id ?? "guest";
  const ext = (file.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
  const uuid = crypto.randomUUID();
  const path = `${prefix}/${uuid}.${ext}`;

  const { error } = await supabase.storage.from("uploads").upload(path, file, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });
  if (error) throw new Error(error.message);

  return { path, size: file.size };
}

export async function deleteUpload(path: string): Promise<void> {
  await supabase.storage.from("uploads").remove([path]);
}