export interface AuditAdapterConfig {
  url: string;
  showAudits?: boolean;

  settings?: {
    formFactor?: 'desktop' | 'mobile';
    throttlingMethod?: 'simulate' | 'devtools';
    screenEmulation?: {
      mobile?: boolean;
      width?: number;
      height?: number;
      deviceScaleFactor?: number;
      disabled?: boolean;
    };
    emulatedUserAgent?: string;
  };

  categories?: Array<
    'performance' | 'seo' | 'accessibility' | 'best-practices'
  >;

  chrome?: {
    flags?: string[];
    chromePath?: string;
    keepAlive?: boolean;
  };

  lhOptions?: {
    logLevel?: 'info' | 'silent' | 'error' | 'verbose';
    output?: ('html' | 'json')[];
    onlyCategories?: Array<
      'performance' | 'seo' | 'accessibility' | 'best-practices'
    >;
  };
}
