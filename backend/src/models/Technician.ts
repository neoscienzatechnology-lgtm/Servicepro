import mongoose, { Document, Schema } from 'mongoose';

export interface ITechnician extends Document {
  user: mongoose.Types.ObjectId;
  company: mongoose.Types.ObjectId;
  specialties: string[];
  skills: string[];
  certifications: Array<{
    name: string;
    issuer: string;
    issueDate: Date;
    expiryDate?: Date;
    certificateNumber?: string;
  }>;
  availability: {
    monday: { isAvailable: boolean; startTime: string; endTime: string };
    tuesday: { isAvailable: boolean; startTime: string; endTime: string };
    wednesday: { isAvailable: boolean; startTime: string; endTime: string };
    thursday: { isAvailable: boolean; startTime: string; endTime: string };
    friday: { isAvailable: boolean; startTime: string; endTime: string };
    saturday: { isAvailable: boolean; startTime: string; endTime: string };
    sunday: { isAvailable: boolean; startTime: string; endTime: string };
  };
  hourlyRate: number;
  commissionRate?: number;
  serviceRadius: number; // em km
  currentLocation?: {
    lat: number;
    lng: number;
    lastUpdated: Date;
  };
  rating: number;
  totalJobs: number;
  completedJobs: number;
  cancelledJobs: number;
  totalRevenue: number;
  vehicleInfo?: {
    make: string;
    model: string;
    year: number;
    licensePlate: string;
  };
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  isAvailableNow: boolean;
  status: 'available' | 'busy' | 'offline' | 'on-break';
  createdAt: Date;
  updatedAt: Date;
}

const TechnicianSchema = new Schema<ITechnician>(
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
    specialties: [{ type: String }],
    skills: [{ type: String }],
    certifications: [
      {
        name: String,
        issuer: String,
        issueDate: Date,
        expiryDate: Date,
        certificateNumber: String
      }
    ],
    availability: {
      monday: {
        isAvailable: { type: Boolean, default: true },
        startTime: { type: String, default: '08:00' },
        endTime: { type: String, default: '17:00' }
      },
      tuesday: {
        isAvailable: { type: Boolean, default: true },
        startTime: { type: String, default: '08:00' },
        endTime: { type: String, default: '17:00' }
      },
      wednesday: {
        isAvailable: { type: Boolean, default: true },
        startTime: { type: String, default: '08:00' },
        endTime: { type: String, default: '17:00' }
      },
      thursday: {
        isAvailable: { type: Boolean, default: true },
        startTime: { type: String, default: '08:00' },
        endTime: { type: String, default: '17:00' }
      },
      friday: {
        isAvailable: { type: Boolean, default: true },
        startTime: { type: String, default: '08:00' },
        endTime: { type: String, default: '17:00' }
      },
      saturday: {
        isAvailable: { type: Boolean, default: false },
        startTime: { type: String, default: '08:00' },
        endTime: { type: String, default: '12:00' }
      },
      sunday: {
        isAvailable: { type: Boolean, default: false },
        startTime: { type: String, default: '08:00' },
        endTime: { type: String, default: '12:00' }
      }
    },
    hourlyRate: {
      type: Number,
      required: true,
      min: 0
    },
    commissionRate: {
      type: Number,
      min: 0,
      max: 100
    },
    serviceRadius: {
      type: Number,
      default: 50 // km
    },
    currentLocation: {
      lat: Number,
      lng: Number,
      lastUpdated: Date
    },
    rating: {
      type: Number,
      default: 5,
      min: 0,
      max: 5
    },
    totalJobs: { type: Number, default: 0 },
    completedJobs: { type: Number, default: 0 },
    cancelledJobs: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    vehicleInfo: {
      make: String,
      model: String,
      year: Number,
      licensePlate: String
    },
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String
    },
    isAvailableNow: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['available', 'busy', 'offline', 'on-break'],
      default: 'offline'
    }
  },
  {
    timestamps: true
  }
);

// Indexes
TechnicianSchema.index({ company: 1 });
TechnicianSchema.index({ status: 1 });
TechnicianSchema.index({ specialties: 1 });
TechnicianSchema.index({ 'currentLocation.lat': 1, 'currentLocation.lng': 1 });

export default mongoose.model<ITechnician>('Technician', TechnicianSchema);
