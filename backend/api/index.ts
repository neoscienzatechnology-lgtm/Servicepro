import type { VercelRequest, VercelResponse } from '@vercel/node';
import mongoose from 'mongoose';

// Cache da conexão MongoDB
let cachedDb: any = null;

async function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }

  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    throw new Error('MONGODB_URI não configurado');
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      bufferCommands: false,
    });
    cachedDb = conn;
    console.log('MongoDB Connected');
    return cachedDb;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Conectar ao banco
    await connectToDatabase();

    // Health check
    if (req.url === '/health' || req.url === '/') {
      return res.status(200).json({ 
        status: 'OK',
        message: 'ServiceFlow Pro API',
        timestamp: new Date(),
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        jwtSecret: process.env.JWT_SECRET ? `${process.env.JWT_SECRET.substring(0, 10)}...` : 'NOT SET'
      });
    }

    // Endpoint de debug para FORÇAR novo login e gerar novo token
    if (req.url === '/api/auth/debug-login' && req.method === 'POST') {
      const { default: app } = await import('../src/server');
      return app(req, res);
    }

    // Importar e usar o app Express apenas quando necessário
    const { default: app } = await import('../src/server');
    return app(req, res);

  } catch (error: any) {
    console.error('Handler error:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'Internal Server Error',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
