import mongoose, { Document, Schema } from 'mongoose';

export interface ICustomer extends Document {
  user: mongoose.Types.ObjectId;
  company: mongoose.Types.ObjectId;
  addresses: Array<{
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault: boolean;
    coordinates?: {
      lat: number;
      lng: number;
    };
  }>;
  tags: string[];
  notes: string;
  referralSource?: string;
  customerSince: Date;
  totalSpent: number;
  totalJobs: number;
  status: 'active' | 'inactive' | 'blocked';
  preferences: {
    preferredTechnician?: mongoose.Types.ObjectId;
    preferredDayOfWeek?: string[];
    preferredTimeOfDay?: string;
    communicationMethod: 'email' | 'sms' | 'both';
  };
  customFields?: Map<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema = new Schema<ICustomer>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true
    },
    addresses: [
      {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        country: { type: String, default: 'BR' },
        isDefault: { type: Boolean, default: false },
        coordinates: {
          lat: Number,
          lng: Number
        }
      }
    ],
    tags: [{ type: String }],
    notes: { type: String, default: '' },
    referralSource: String,
    customerSince: { type: Date, default: Date.now },
    totalSpent: { type: Number, default: 0 },
    totalJobs: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['active', 'inactive', 'blocked'],
      default: 'active'
    },
    preferences: {
      preferredTechnician: {
        type: Schema.Types.ObjectId,
        ref: 'Technician'
      },
      preferredDayOfWeek: [String],
      preferredTimeOfDay: String,
      communicationMethod: {
        type: String,
        enum: ['email', 'sms', 'both'],
        default: 'both'
      }
    },
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
CustomerSchema.index({ company: 1, user: 1 });
CustomerSchema.index({ tags: 1 });
CustomerSchema.index({ status: 1 });

export default mongoose.model<ICustomer>('Customer', CustomerSchema);
