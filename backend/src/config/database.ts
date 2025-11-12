import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer | null = null;

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI!;

    // Se não houver URI configurada ou for localhost, usa MongoDB em memória
    if (!mongoUri || mongoUri.includes('localhost')) {
      console.log('🔧 Iniciando MongoDB em memória para desenvolvimento...');
      mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
      console.log('✅ MongoDB em memória iniciado com sucesso!');
    }
    
    const conn = await mongoose.connect(mongoUri);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error: any) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
  } catch (error: any) {
    console.error(`Error disconnecting: ${error.message}`);
  }
};

export default connectDB;
