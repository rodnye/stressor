<div align="center">
  <img src="https://github.com/rodnye/stressor/blob/main/assets/logo.png?raw=true" alt="Stressor Logo" width="300" />
 
  <div>
    <a href="https://www.npmjs.com/package/stressor-core">
      <img src="https://img.shields.io/npm/v/stressor-core.svg" alt="npm version" />
    </a>
    <a href="LICENSE">
      <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License" />
    </a>
    <a href="https://nodejs.org/">
      <img src="https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg" alt="Node.js" />
    </a>
    <a href="https://www.typescriptlang.org/">
      <img src="https://img.shields.io/badge/TypeScript-Ready-blue.svg" alt="TypeScript" />
    </a>
  </div>
  
  <p><em>Tus pruebas de rendimiento y velocidad en un solo lugar</em></p>
</div>

## Qué?

Stressor es un orquestador de pruebas de rendimiento y velocidad que utiliza **k6** para pruebas de carga y **Lighthouse** para auditorías, ofreciendo una salida unificada y personalizable. Ejecutable como servidor o integrable en proyectos TypeScript.

## Características

- **Pipeline de adaptadores** - Sistema extensible para múltiples motores de testing
- **Soporte dual** - Pruebas de carga (k6) y auditorías (Lighthouse)
- Resultados sanitizados y normalizados
- **Tipado fuerte** - TypeScript-first con tipos inferidos dinámicamente

## Instalación

```bash
npm install stressor-core
# o
pnpm add stressor-core
```

## Uso Rápido

```typescript
import { Stressor } from 'stressor';

const stressor = new Stressor({
  name: 'mi-test',
  load: {
    scenario: {
      executor: 'ramping-vus',
      stages: [
        { duration: '30s', target: 10 },
        { duration: '1m', target: 50 },
      ],
    },
    options: {
      vus: 50,
      duration: '1m30s',
    },
  },
});

const report = await stressor.run();
```

## Configuración

### Ejemplo Completo

```json
{
  "id": "test-completo",
  "name": "Prueba Ecommerce",
  "load": {
    "scenario": {
      "executor": "constant-vus",
      "vus": 20,
      "duration": "5m"
    },
    "options": {
      "thresholds": {
        "http_req_duration": ["p(95)<500"]
      }
    }
  },
  "audit": {
    "url": "https://mi-sitio.com",
    "categories": ["performance", "seo"],
    "settings": {
      "formFactor": "desktop"
    }
  }
}
```

## Ecosistema

### CLI Tool

> [Enlace al proyecto](https://github.com/rodnye/stressor-cli)

Stressor incluye una CLI completa para ejecutar pruebas desde terminal:

```bash
# Instalación global
npm install -g stressor-cli

# Ejecutar tests desde archivo de configuración
stressor run -c config.yaml

# Ejecutar audit test directo
stressor test audit --url https://example.com

# Ejecutar load test directo
stressor test load --scenario ./tests/api.yml --vus 20 --duration 1m
```

**Comandos principales:**
- `stressor run` - Ejecuta tests desde archivo de configuración
- `stressor test audit` - Ejecuta auditorías Lighthouse
- `stressor test load` - Ejecuta pruebas de carga k6


## API Reference

### Clase Principal

```typescript
class Stressor {
  constructor(config: StressorConfig)
  async run(changes?: Partial<StressorConfig>): Promise<StressorReport>
}
```