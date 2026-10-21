import express from 'express';
import cors from 'cors';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';
import cepRoutes from './routes/cep.routes';
import healthRoutes from './routes/health.routes';
import { errorHandler } from './middlewares/error.middleware';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/cep', cepRoutes);
app.use('/api/health', healthRoutes);

const frontendPath = path.join(__dirname, '..', '..', 'front-end');
app.use(express.static(frontendPath));

app.use(errorHandler);

export default app;
