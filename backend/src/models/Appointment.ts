import mongoose, { Document, Schema } from 'mongoose';

export interface IAppointment extends Document {
  company: mongoose.Types.ObjectId;
  customer: mongoose.Types.ObjectId;
  technician?: mongoose.Types.ObjectId;
  service: mongoose.Types.ObjectId;
  scheduledDate: Date;
  scheduledStartTime: string;
  scheduledEndTime: string;
  actualStartTime?: Date;
  actualEndTime?: Date;
  duration: number; // minutos
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  description: string;
  internalNotes?: string;
  customFields?: Map<string, any>;
  notifications: {
    reminderSent: boolean;
    confirmationSent: boolean;
    completionSent: boolean;
  };
  checkIn?: {
    time: Date;
    location: {
      lat: number;
      lng: number;
    };
    photos?: string[];
  };
  checkOut?: {
    time: Date;
    location: {
      lat: number;
      lng: number;
    };
    photos?: string[];
    customerSignature?: string;
  };
  cancellationReason?: string;
  cancelledBy?: mongoose.Types.ObjectId;
  cancelledAt?: Date;
  estimatedCost: number;
  actualCost?: number;
  invoice?: mongoose.Types.ObjectId;
  rating?: {
    score: number;
    comment?: string;
    ratedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: true
    },
    technician: {
      type: Schema.Types.ObjectId,
      ref: 'Technician'
    },
    service: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
      required: true
    },
    scheduledDate: {
      type: Date,
      required: true
    },
    scheduledStartTime: {
      type: String,
      required: true
    },
    scheduledEndTime: {
      type: String,
      required: true
    },
    actualStartTime: Date,
    actualEndTime: Date,
    duration: {
      type: Number,
      required: true,
      min: 15
    },
    status: {
      type: String,
      enum: ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'],
      default: 'scheduled'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, default: 'BR' },
      coordinates: {
        lat: Number,
        lng: Number
      }
    },
    description: {
      type: String,
      required: true
    },
    internalNotes: String,
    customFields: {
      type: Map,
      of: Schema.Types.Mixed
    },
    notifications: {
      reminderSent: { type: Boolean, default: false },
      confirmationSent: { type: Boolean, default: false },
      completionSent: { type: Boolean, default: false }
    },
    checkIn: {
      time: Date,
      location: {
        lat: Number,
        lng: Number
      },
      photos: [String]
    },
    checkOut: {
      time: Date,
      location: {
        lat: Number,
        lng: Number
      },
      photos: [String],
      customerSignature: String
    },
    cancellationReason: String,
    cancelledBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    cancelledAt: Date,
    estimatedCost: {
      type: Number,
      required: true,
      min: 0
    },
    actualCost: {
      type: Number,
      min: 0
    },
    invoice: {
      type: Schema.Types.ObjectId,
      ref: 'Invoice'
    },
    rating: {
      score: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: String,
      ratedAt: Date
    }
  },
  {
    timestamps: true
  }
);

// Indexes
AppointmentSchema.index({ company: 1, scheduledDate: 1 });
AppointmentSchema.index({ customer: 1 });
AppointmentSchema.index({ technician: 1, scheduledDate: 1 });
AppointmentSchema.index({ status: 1 });

export default mongoose.model<IAppointment>('Appointment', AppointmentSchema);
