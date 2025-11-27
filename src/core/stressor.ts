import { K6Adapter } from '../adapters/k6';
import { StressorConfig } from '../types/config';
import { RawReport } from '../types/report';

export class Stressor {
  config: StressorConfig;
  k6Adapter: K6Adapter;

  constructor(config: StressorConfig) {
    this.config = config;
    this.k6Adapter = new K6Adapter();
  }

  async run(scenarioName: string) {
    const scenario = this.config.scenarios[scenarioName];

    if (!scenario) {
      throw new Error(`Scenario ${scenarioName} not found`);
    }

    const results: RawReport = {};

    if (scenario.load) {
      results.load = await this.k6Adapter.execute({
        name: scenarioName,
        ...scenario.load,
      });
    }
    if (scenario.audit) {
      throw new Error('Audit method not implemented');
    }

    return results;
  }
}
