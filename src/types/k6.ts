
type MetricType = 'gauge' | 'counter' | 'trend' | 'rate';
type ContainsType = 'default' | 'time' | 'data';

interface MetricTags {
  expected_response?: string;
  group?: string;
  method?: string;
  name?: string;
  proto?: string;
  scenario?: string;
  status?: string;
  tls_version?: string;
  url?: string;
}

interface Submetric {
  name: string;
  suffix: string;
  tags: Partial<MetricTags>;
}

interface MetricData {
  name: string;
  type: MetricType;
  contains: ContainsType;
  thresholds: any[]; // Siempre array vacío en los ejemplos
  submetrics: Submetric[] | null;
}

interface PointData {
  time: string; // ISO string con timezone
  value: number;
  tags: Partial<MetricTags> | { group?: string; scenario?: string };
}

export type K6Metric =
  | {
      type: 'Metric';
      data: MetricData;
      metric: string;
    }
  | {
      type: 'Point';
      data: PointData;
      metric: string;
    };