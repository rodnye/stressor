import { Scenario } from './scenarios';

/**
 * 
 */
export interface StressorConfig {
  scenarios: Record<string, Scenario>;
}
