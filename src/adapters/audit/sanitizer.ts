import { AuditAdapterReport, AuditCategoryResult } from './types/report';

export class LighthouseSanitizer {
  constructor(private raw: any, private showAudits: boolean = false) {}

  sanitize(): AuditAdapterReport {
    const categories = this.raw.lhr.categories;

    const base: AuditAdapterReport = {
      url: this.raw.lhr.requestedUrl,
      categories: Object.values(categories).map((c: any) => ({
        id: c.id,
        score: c.score,
      })),
      performance: categories.performance?.score ?? null,
      accessibility: categories.accessibility?.score ?? null,
      seo: categories.seo?.score ?? null,
      bestPractices: categories['best-practices']?.score ?? null,
    };

    if (this.showAudits) {
      return {
        ...base,
        audits: (Object.values(this.raw.lhr.audits) as AuditCategoryResult[]).filter(
          (value) => value.score !== 1
        ),
      } as AuditAdapterReport;
    }

    return base;
  }
}
