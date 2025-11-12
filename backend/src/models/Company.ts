import mongoose, { Document, Schema } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  email: string;
  phone: string;
  website?: string;
  logo?: string;
  description?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  businessType: string;
  taxId: string; // CNPJ/CPF
  settings: {
    timezone: string;
    currency: string;
    dateFormat: string;
    timeFormat: string;
    workingHours: {
      start: string;
      end: string;
    };
    appointmentBuffer: number; // minutos entre agendamentos
    enableOnlineBooking: boolean;
    requireDepositForBooking: boolean;
    depositAmount?: number;
    autoAssignTechnicians: boolean;
    sendAutomaticReminders: boolean;
    reminderTimeBefore: number; // horas antes
  };
  billing: {
    plan: 'free' | 'basic' | 'professional' | 'enterprise';
    billingCycle: 'monthly' | 'yearly';
    paymentMethod?: string;
    nextBillingDate?: Date;
    isActive: boolean;
  };
  integrations: {
    stripe?: {
      accountId: string;
      isConnected: boolean;
    };
    googleCalendar?: {
      isConnected: boolean;
      calendarId?: string;
    };
    quickbooks?: {
      isConnected: boolean;
      companyId?: string;
    };
  };
  subscription: {
    maxUsers: number;
    maxTechnicians: number;
    maxCustomers: number;
    features: string[];
  };
  owner: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema = new Schema<ICompany>(
  {
    name: {
      type: String,
      required: [true, 'Por favor, adicione o nome da empresa'],
      trim: true,
      maxlength: [100, 'Nome não pode ter mais de 100 caracteres']
    },
    email: {
      type: String,
      required: [true, 'Por favor, adicione um email'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Por favor, adicione um email válido'
      ]
    },
    phone: {
      type: String,
      required: [true, 'Por favor, adicione um telefone']
    },
    website: String,
    logo: String,
    description: String,
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, default: 'BR' }
    },
    businessType: {
      type: String,
      required: true
    },
    taxId: {
      type: String,
      required: true,
      unique: true
    },
    settings: {
      timezone: { type: String, default: 'America/Sao_Paulo' },
      currency: { type: String, default: 'BRL' },
      dateFormat: { type: String, default: 'DD/MM/YYYY' },
      timeFormat: { type: String, default: '24h' },
      workingHours: {
        start: { type: String, default: '08:00' },
        end: { type: String, default: '18:00' }
      },
      appointmentBuffer: { type: Number, default: 15 },
      enableOnlineBooking: { type: Boolean, default: true },
      requireDepositForBooking: { type: Boolean, default: false },
      depositAmount: Number,
      autoAssignTechnicians: { type: Boolean, default: true },
      sendAutomaticReminders: { type: Boolean, default: true },
      reminderTimeBefore: { type: Number, default: 24 }
    },
    billing: {
      plan: {
        type: String,
        enum: ['free', 'basic', 'professional', 'enterprise'],
        default: 'free'
      },
      billingCycle: {
        type: String,
        enum: ['monthly', 'yearly'],
        default: 'monthly'
      },
      paymentMethod: String,
      nextBillingDate: Date,
      isActive: { type: Boolean, default: true }
    },
    integrations: {
      stripe: {
        accountId: String,
        isConnected: { type: Boolean, default: false }
      },
      googleCalendar: {
        isConnected: { type: Boolean, default: false },
        calendarId: String
      },
      quickbooks: {
        isConnected: { type: Boolean, default: false },
        companyId: String
      }
    },
    subscription: {
      maxUsers: { type: Number, default: 5 },
      maxTechnicians: { type: Number, default: 3 },
      maxCustomers: { type: Number, default: 100 },
      features: [{ type: String }]
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Indexes
CompanySchema.index({ owner: 1 });
CompanySchema.index({ isActive: 1 });

export default mongoose.model<ICompany>('Company', CompanySchema);
