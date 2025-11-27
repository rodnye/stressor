import { Scenario as K6Scenario } from 'k6-node';

/**
 * Data for backend
 */
export type LoadScenarioData = {
  steps: K6Scenario["steps"];
  executor?: K6Scenario["executor"];
};

/**
 * Data for frontend performance
 */
export type AuditScenarioData = {};

/**
 *
 */
export type Scenario = {
  load?: LoadScenarioData;
  audit?: AuditScenarioData;
}

