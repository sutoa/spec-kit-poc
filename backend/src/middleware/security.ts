import cors from 'cors';
import helmet from 'helmet';
import { Application } from 'express';

export function setupSecurity(app: Application) {
  app.use(cors());
  app.use(helmet());
}
