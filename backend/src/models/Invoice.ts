import mongoose, { Document, Schema } from 'mongoose';

export interface IInvoice extends Document {
  company: mongoose.Types.ObjectId;
  customer: mongoose.Types.ObjectId;
  appointment?: mongoose.Types.ObjectId;
  invoiceNumber: string;
  issueDate: Date;
  dueDate: Date;
  status: 'draft' | 'sent' | 'viewed' | 'paid' | 'partial' | 'overdue' | 'cancelled';
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    taxRate: number;
    discount: number;
    total: number;
  }>;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  amountPaid: number;
  amountDue: number;
  currency: string;
  notes?: string;
  terms?: string;
  payments: Array<{
    amount: number;
    method: 'cash' | 'credit_card' | 'debit_card' | 'bank_transfer' | 'pix' | 'check';
    transactionId?: string;
    paidAt: Date;
    notes?: string;
  }>;
  reminders: Array<{
    sentAt: Date;
    method: 'email' | 'sms';
  }>;
  attachments?: string[];
  customFields?: Map<string, any>;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceSchema = new Schema<IInvoice>(
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
    appointment: {
      type: Schema.Types.ObjectId,
      ref: 'Appointment'
    },
    invoiceNumber: {
      type: String,
      required: true,
      unique: true
    },
    issueDate: {
      type: Date,
      default: Date.now
    },
    dueDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['draft', 'sent', 'viewed', 'paid', 'partial', 'overdue', 'cancelled'],
      default: 'draft'
    },
    items: [
      {
        description: { type: String, required: true },
        quantity: { type: Number, required: true, min: 0 },
        unitPrice: { type: Number, required: true, min: 0 },
        taxRate: { type: Number, default: 0, min: 0 },
        discount: { type: Number, default: 0, min: 0 },
        total: { type: Number, required: true, min: 0 }
      }
    ],
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    taxAmount: {
      type: Number,
      default: 0,
      min: 0
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: 0
    },
    total: {
      type: Number,
      required: true,
      min: 0
    },
    amountPaid: {
      type: Number,
      default: 0,
      min: 0
    },
    amountDue: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: 'BRL'
    },
    notes: String,
    terms: String,
    payments: [
      {
        amount: { type: Number, required: true },
        method: {
          type: String,
          enum: ['cash', 'credit_card', 'debit_card', 'bank_transfer', 'pix', 'check'],
          required: true
        },
        transactionId: String,
        paidAt: { type: Date, default: Date.now },
        notes: String
      }
    ],
    reminders: [
      {
        sentAt: { type: Date, default: Date.now },
        method: {
          type: String,
          enum: ['email', 'sms']
        }
      }
    ],
    attachments: [{ type: String }],
    customFields: {
      type: Map,
      of: Schema.Types.Mixed
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Indexes
InvoiceSchema.index({ company: 1, invoiceNumber: 1 }, { unique: true });
InvoiceSchema.index({ customer: 1 });
InvoiceSchema.index({ status: 1 });
InvoiceSchema.index({ dueDate: 1 });

// Auto-generate invoice number
InvoiceSchema.pre('save', async function (next) {
  if (!this.invoiceNumber) {
    const count = await mongoose.model('Invoice').countDocuments({ company: this.company });
    this.invoiceNumber = `INV-${Date.now()}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

export default mongoose.model<IInvoice>('Invoice', InvoiceSchema);
