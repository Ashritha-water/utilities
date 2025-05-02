const fs = require('fs');
const path = require('path');

const services = [
  'consumer-lifecycle-service',
  'consumer-document-management-service',
  'workflow-approval-service',
  'scheme-subsidy-management-service',
  'billing-lifecycle-management-service',
  'tariff-management-service',
  'collection-management-service',
  'payment-gateway-integration-service',
  'iot-device-management-service',
  'meter-reading-management-service',
  'meter-management-inventory-service',
  'complaint-grievance-management-service',
  'service-request-management-service',
  'notification-communication-service',
  'user-identity-access-management-service',
  'audit-logging-compliance-service',
  'policy-rule-engine-service',
  'dynamic-configuration-management-service',
  'analytics-reporting-service',
  'revenue-forecasting-leakage-detection-service',
  'third-party-integration-gateway-service',
  'gis-location-management-service'
];

const packageJson = (name) => `{
  "name": "${name}",
  "version": "1.0.0",
  "main": "dist/index.js",
  "scripts": {
    "start": "node dist/index.js",
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "build": "tsc"
  },
  "dependencies": {
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "sequelize": "^6.32.1",
    "pg": "^8.11.1"
  },
  "devDependencies": {
    "@types/express": "^4.17.17",
    "@types/node": "^20.4.2",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.0.4"
  }
}
`;

const tsconfig = `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
`;

const envFile = `PORT=3000
DATABASE_URL=postgres://postgres:root@localhost:5432/${Math.random().toString(36).substring(2, 8)}
NODE_ENV=development
`;

const gitignore = `node_modules
dist
.env
`;

const readme = (service) => `# ${service.replace(/-/g, ' ')}

This is a TypeScript microservice for ${service.replace(/-/g, ' ')}.

## Scripts

- \`npm run dev\` — Start in development mode
- \`npm run build\` — Compile TypeScript
- \`npm start\` — Run compiled JS

## Endpoints

- \`GET /health\` — Health check
- \`GET /example\` — Example endpoint
`;

const databaseTs = `import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

export const sequelize = new Sequelize(process.env.DATABASE_URL || '', {
  dialect: 'postgres',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? {
      require: true,
      rejectUnauthorized: false
    } : false
  }
});
`;

const modelPlaceholder = `// Add your Sequelize models here
`;

const routesTs = (service) => `import { Router, Request, Response } from 'express';

const router = Router();

router.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: '${service.replace(/-/g, ' ')}' });
});

// Example endpoint
router.get('/example', (req: Request, res: Response) => {
  res.json({ message: 'This is an example endpoint for ${service.replace(/-/g, ' ')}.' });
});

export default router;
`;

const indexTs = (service) => `import express from 'express';
import dotenv from 'dotenv';
import routes from './routes';
import { sequelize } from './config/database';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/', routes);

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

sequelize.authenticate()
  .then(() => {
    console.log('Database connected!');
    app.listen(port, () => {
      console.log('${service.replace(/-/g, ' ')} running on port ' + port);
    });
  })
  .catch((err: any) => {
    console.error('Unable to connect to the database:', err);
  });
`;

services.forEach(service => {
  const baseDir = path.join(__dirname, service);
  const srcDir = path.join(baseDir, 'src');
  const configDir = path.join(srcDir, 'config');
  const modelsDir = path.join(srcDir, 'models');
  const routesDir = path.join(srcDir, 'routes');

  fs.mkdirSync(configDir, { recursive: true });
  fs.mkdirSync(modelsDir, { recursive: true });
  fs.mkdirSync(routesDir, { recursive: true });

  fs.writeFileSync(path.join(baseDir, 'package.json'), packageJson(service));
  fs.writeFileSync(path.join(baseDir, 'tsconfig.json'), tsconfig);
  fs.writeFileSync(path.join(baseDir, '.env'), envFile);
  fs.writeFileSync(path.join(baseDir, '.gitignore'), gitignore);
  fs.writeFileSync(path.join(baseDir, 'README.md'), readme(service));

  fs.writeFileSync(path.join(configDir, 'database.ts'), databaseTs);
  fs.writeFileSync(path.join(modelsDir, 'placeholder.ts'), modelPlaceholder);
  fs.writeFileSync(path.join(routesDir, 'index.ts'), routesTs(service));
  fs.writeFileSync(path.join(srcDir, 'index.ts'), indexTs(service));
});

console.log('All TypeScript microservice templates generated!');