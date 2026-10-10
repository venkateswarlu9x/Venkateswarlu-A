/**
 * Express REST API Server & Vite Dev Integration
 * Employee Management System – B.Tech Final Year Project
 */

import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import employeeRoutes from './backend/routes/employeeRoutes.js';
import departmentRoutes from './backend/routes/departmentRoutes.js';
import statsRoutes from './backend/routes/statsRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic CORS headers for local testing and cross-origin compatibility
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (_req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

// Request logger for development insight
app.use((req: Request, _res: Response, next: NextFunction) => {
  if (req.url.startsWith('/api')) {
    console.log(`[REST API] ${req.method} ${req.url}`);
  }
  next();
});

// REST API Endpoints
app.use('/api/employees', employeeRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/stats', statsRoutes);

// System Health and Metadata API
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'OK',
    project: 'Employee Management System – HR CRUD with Department Filters',
    academicLevel: 'B.Tech Final Year CSE/IT',
    database: 'MySQL Relational Architecture',
    timestamp: new Date().toISOString(),
  });
});

// Global Error Handler for API
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[API Error]:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Vite Middleware for Development / Static serving for Production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`=======================================================`);
    console.log(` Employee Management System is running on port ${PORT}`);
    console.log(` Frontend: http://localhost:${PORT}`);
    console.log(` REST API: http://localhost:${PORT}/api/employees`);
    console.log(`=======================================================`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
