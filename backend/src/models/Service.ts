import mongoose, { Document, Schema } from 'mongoose';

export interface IService extends Document {
  company: mongoose.Types.ObjectId;
  name: string;
  description: string;
  category: string;
  basePrice: number;
  pricingType: 'fixed' | 'hourly' | 'custom';
  estimatedDuration: number; // minutos
  isActive: boolean;
  taxRate?: number;
  tags: string[];
  requiredSkills: string[];
  materials?: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
  }>;
  images?: string[];
  customFields?: Map<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true
    },
    name: {
      type: String,
      required: [true, 'Por favor, adicione um nome para o serviço'],
      trim: true,
      maxlength: [100, 'Nome não pode ter mais de 100 caracteres']
    },
    description: {
      type: String,
      required: [true, 'Por favor, adicione uma descrição'],
      maxlength: [500, 'Descrição não pode ter mais de 500 caracteres']
    },
    category: {
      type: String,
      required: true
    },
    basePrice: {
      type: Number,
      required: [true, 'Por favor, adicione um preço base'],
      min: 0
    },
    pricingType: {
      type: String,
      enum: ['fixed', 'hourly', 'custom'],
      default: 'fixed'
    },
    estimatedDuration: {
      type: Number,
      required: true,
      min: 15
    },
    isActive: {
      type: Boolean,
      default: true
    },
    taxRate: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    tags: [{ type: String }],
    requiredSkills: [{ type: String }],
    materials: [
      {
        name: String,
        quantity: Number,
        unitPrice: Number
      }
    ],
    images: [{ type: String }],
    customFields: {
      type: Map,
      of: Schema.Types.Mixed
    }
  },
  {
    timestamps: true
  }
);

// Indexes
ServiceSchema.index({ company: 1, isActive: 1 });
ServiceSchema.index({ category: 1 });
ServiceSchema.index({ tags: 1 });

export default mongoose.model<IService>('Service', ServiceSchema);
