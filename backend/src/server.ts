import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import connectDB from './config/database';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
import cookieParser from 'cookie-parser';
app.use(cookieParser());

// Enable CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Security headers
app.use(helmet());

// Compression
app.use(compression());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Import routes
import authRoutes from './routes/auth';
import customerRoutes from './routes/customers';
import technicianRoutes from './routes/technicians';
import appointmentRoutes from './routes/appointments';
import serviceRoutes from './routes/services';
import invoiceRoutes from './routes/invoices';
import companyRoutes from './routes/companies';

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/technicians', technicianRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/companies', companyRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error'
  });
});

const PORT = process.env.PORT || 5000;

// Only start server if not in serverless environment
if (process.env.VERCEL !== '1') {
  const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err: Error) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
  });
}

export default app;
