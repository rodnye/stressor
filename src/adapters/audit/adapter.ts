import { Adapter } from '../../types/adapter';
import { launch, LaunchedChrome } from 'chrome-launcher';
import { AuditAdapterConfig } from './types/config';
import { LighthouseSanitizer } from './sanitizer';
import { AuditAdapterReport } from './types/report';
import lighthouse from 'lighthouse/core/index.cjs';
import fs from 'node:fs';
import path from 'node:path';

type FormFactor = 'mobile' | 'desktop';
type ThrottlingMethod = 'simulate' | 'devtools' | 'provided';

const DEFAULT_CATEGORIES = [
  'performance',
  'seo',
  'accessibility',
  'best-practices',
];

export class AuditAdapter implements Adapter<AuditAdapterConfig, AuditAdapterReport> {
  /**
   * 
   */
  private resolveChromePath(config: AuditAdapterConfig): string | undefined {
    if (config.chrome?.chromePath) {
      return config.chrome.chromePath;
    }

    if (process.env.CHROME_PATH) {
      return process.env.CHROME_PATH;
    }

    const filePath = path.resolve(process.cwd(), '.chromepath');
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8').trim();
      if (content.length > 0) return content;
    }

    const pkgPath = path.resolve(process.cwd(), 'package.json');
    if (fs.existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        if (pkg.chromePath) return pkg.chromePath;
      } catch {}
    }

    return undefined;
  }

  private validateConfig(config?: AuditAdapterConfig) {
    if (!config) throw new Error('AuditAdapterConfig is required');
    if (!config.url) throw new Error('AuditAdapterConfig.url is required');

    const ff = config.settings?.formFactor;
    if (ff && ff !== 'mobile' && ff !== 'desktop') {
      throw new Error(
        `Invalid formFactor '${ff}', allowed values: 'mobile' | 'desktop'`
      );
    }

    const tm = config.settings?.throttlingMethod;
    if (tm && tm !== 'simulate' && tm !== 'devtools' && tm !== 'provided') {
      throw new Error(
        `Invalid throttlingMethod '${tm}', allowed values: 'simulate' | 'devtools' | 'provided'`
      );
    }
  }

  /**
   * 
   */
  private buildLighthouseConfig(config: AuditAdapterConfig) {
    const formFactor: FormFactor = (config.settings?.formFactor ||
      'desktop') as FormFactor;
    const throttlingMethod: ThrottlingMethod = (config.settings
      ?.throttlingMethod || 'simulate') as ThrottlingMethod;

    const screenEmulation =
      formFactor === 'mobile'
        ? {
            mobile: true,
            width: config.settings?.screenEmulation?.width ?? 360,
            height: config.settings?.screenEmulation?.height ?? 640,
            deviceScaleFactor:
              config.settings?.screenEmulation?.deviceScaleFactor ?? 2,
            disabled: config.settings?.screenEmulation?.disabled ?? false,
          }
        : {
            mobile: false,
            width: config.settings?.screenEmulation?.width ?? 1350,
            height: config.settings?.screenEmulation?.height ?? 940,
            deviceScaleFactor:
              config.settings?.screenEmulation?.deviceScaleFactor ?? 1,
            disabled: config.settings?.screenEmulation?.disabled ?? false,
          };

    const categories =
      config.categories && config.categories.length > 0
        ? config.categories
        : DEFAULT_CATEGORIES;

    return {
      extends: 'lighthouse:default',
      settings: {
        formFactor,
        throttlingMethod,
        screenEmulation,
        categories,
      },
    };
  }

  /**
   * Execute
   */
  async run(config: AuditAdapterConfig): Promise<AuditAdapterReport> {
    this.validateConfig(config);

    let chrome: LaunchedChrome | null = null;

    try {
      const chromePath = this.resolveChromePath(config);

      chrome = await launch({
        chromeFlags: [
          '--headless',
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-gpu',
          '--disable-dev-shm-usage',
        ],
        chromePath,
      });

      const lighthouseConfig = this.buildLighthouseConfig(config);

      const options = {
        logLevel: 'silent' as const,
        output: 'json' as const,
        onlyCategories: config.categories ?? DEFAULT_CATEGORIES,
        port: chrome.port,
      };

      console.debug('Launching lighthouse with config:', {
        lighthouseConfig,
        options,
        url: config.url,
      });

      const runnerResult = await lighthouse(
        config.url,
        options,
        lighthouseConfig
      );

      if (!runnerResult) {
        throw new Error('Lighthouse returned an empty runnerResult');
      }

      const sanitizer = new LighthouseSanitizer(runnerResult);
      return sanitizer.sanitize();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      throw new Error(`Lighthouse run failed: ${msg}`);
    } finally {
      try {
        if (chrome) chrome.kill();
      } catch (err) {
        console.warn('Failed to kill Chrome process', err);
      }
    }
  }
}
