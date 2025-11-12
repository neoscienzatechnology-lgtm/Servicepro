import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';

// Import routes
import authRoutes from './routes/auth';
import customerRoutes from './routes/customers';
import technicianRoutes from './routes/technicians';
import appointmentRoutes from './routes/appointments';
import serviceRoutes from './routes/services';
import invoiceRoutes from './routes/invoices';
import companyRoutes from './routes/companies';

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

// Security
app.use(helmet());
app.use(compression());

// Connect to MongoDB (serverless-friendly)
let cachedDb: any = null;
async function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }

  const mongoUri = process.env.MONGODB_URI || '';
  
  if (!mongoUri) {
    throw new Error('MONGODB_URI não configurado');
  }

  const conn = await mongoose.connect(mongoUri);
  cachedDb = conn;
  console.log('MongoDB Connected');
  return cachedDb;
}

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/technicians', technicianRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/companies', companyRoutes);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ 
    message: 'ServiceFlow Pro API',
    status: 'online',
    version: '1.0.0'
  });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error'
  });
});

// Serverless handler
export default async (req: Request, res: Response) => {
  try {
    await connectToDatabase();
    return app(req, res);
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Database connection failed' 
    });
  }
};

// Local server
if (process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
