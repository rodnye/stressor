export interface AuditCategoryResult {
  id: string;
  score: number | null;
}

export interface AuditAdapterReport {
  url: string;
  categories: AuditCategoryResult[];
  performance: number | null;
  accessibility: number | null;
  seo: number | null;
  bestPractices: number | null;
  audits?: AuditCategoryResult[]
}
