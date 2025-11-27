import { K6Metric } from "./k6";

export interface RawReport {
  load?: K6Metric[];
  audit?: Record<string, any>;
}

export interface Summary {
  frontend: Record<string, any>;
  backend: Record<string, any>;
}