import { AuditAdapter } from '../adapters/audit/adapter';
import { LoadAdapter } from '../adapters/load/adapter';
import { AdapterPipeline, PipelineOptions } from './pipeline';
import { LoadAdapterConfig } from '../adapters/load/types/config';
import { LoadAdapterReport } from '../adapters/load/types/report';
import { deepMerge } from '../utils/merge';
import { AuditAdapterConfig } from '../adapters/audit/types/config';

export type JobRunConfig =
  | (LoadAdapterConfig & { type: 'load'; id: string })
  | (AuditAdapterConfig & { type: 'audit'; id: string });

export interface StressorConfig {
  id?: string;
  name: string;
  owner?: string;

  jobs?: JobRunConfig[];
  
  // short form for define specifics jobs
  load?: LoadAdapterConfig;
  audit?: AuditAdapterConfig;

  options?: PipelineOptions;
}

export interface StressorReport {
  [id: string]: LoadAdapterReport | AuditAdapterConfig;
}

export class Stressor {
  config: StressorConfig;

  constructor(config: StressorConfig) {
    this.config = config;
  }

  async run(changes: Partial<StressorConfig> = {}) {
    const current = deepMerge(this.config, changes);
    console.log(current);
    const jobs: JobRunConfig[] = current.jobs || [];
    const options = current.options || {};
    let pipeline = new AdapterPipeline();

    // short form
    if (current.audit) {
      jobs.push({ type: 'audit', id: '', ...current.audit });
    }
    if (current.load) {
      jobs.push({ type: 'load', id: '', ...current.load });
    }

    for (const job of jobs) {
      pipeline = pipeline.addAdapter(
        job.id + '_' + job.type,
        job.type === 'load' ? new LoadAdapter() : new AuditAdapter(),
        job
      );
    }

    console.log(pipeline);

    return pipeline.run(current) as Promise<StressorReport>;
  }
}
