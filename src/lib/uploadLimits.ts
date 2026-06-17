/** Single source of truth for per-tool upload size caps (MB). */
export const UPLOAD_LIMITS_MB = {
  resumeChecker: 50,
  resumeEnhancer: 50,
  smartApply: 50,
  videoResume: 50,
  coverLetter: 10,
  linkedinImport: 10,
  resumeComparison: 10,
  parseResume: 50,
} as const;

export type ToolKey = keyof typeof UPLOAD_LIMITS_MB;

export const limitBytes = (k: ToolKey) => UPLOAD_LIMITS_MB[k] * 1024 * 1024;

export const limitLabel = (k: ToolKey, formats = "PDF, DOCX") =>
  `Max ${UPLOAD_LIMITS_MB[k]}MB · ${formats}`;

export const oversizedMessage = (k: ToolKey) =>
  `File is larger than ${UPLOAD_LIMITS_MB[k]}MB. Please compress or trim and try again.`;