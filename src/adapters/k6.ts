import { K6TestBuilder, Scenario } from 'k6-node';
import { readFile, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { K6Metric } from '../types/k6';

export class K6Adapter {
  async execute(scenario: Scenario) {
    let kl:K6Metric[] = []
    const outputPath = path.join(process.cwd(), Date.now() + '.jsonlist');
    try {
      const builder = new K6TestBuilder();

      builder.addScenario(scenario);
      await builder.run({ output: 'json=' + outputPath });

      return kl = (await readFile(outputPath, 'utf-8'))
        .trim()
        .split('\n')
        .map((json) => JSON.parse(json) as K6Metric);
    } finally {
       await unlink(outputPath);
       await writeFile(path.join(process.cwd(), Date.now() + ".json"), JSON.stringify(kl, null, 2))
    }
  }
}
