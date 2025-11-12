import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  role: 'admin' | 'technician' | 'customer';
  avatar?: string;
  company?: mongoose.Types.ObjectId;
  isActive: boolean;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(enteredPassword: string): Promise<boolean>;
  getSignedJwtToken(): string;
  getResetPasswordToken(): string;
}

const UserSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: [true, 'Por favor, adicione um nome'],
      trim: true,
      maxlength: [50, 'Nome não pode ter mais de 50 caracteres']
    },
    lastName: {
      type: String,
      required: [true, 'Por favor, adicione um sobrenome'],
      trim: true,
      maxlength: [50, 'Sobrenome não pode ter mais de 50 caracteres']
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
    password: {
      type: String,
      required: [true, 'Por favor, adicione uma senha'],
      minlength: [6, 'Senha deve ter no mínimo 6 caracteres'],
      select: false
    },
    phone: {
      type: String,
      required: [true, 'Por favor, adicione um telefone'],
      match: [/^\+?[1-9]\d{1,14}$/, 'Por favor, adicione um telefone válido']
    },
    role: {
      type: String,
      enum: ['admin', 'technician', 'customer'],
      default: 'customer'
    },
    avatar: {
      type: String,
      default: 'default-avatar.png'
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    emailVerificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date
  },
  {
    timestamps: true
  }
);

// Encrypt password using bcrypt
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, 'my-secret-key', {
    expiresIn: '30d'
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.comparePassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');
  
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  return resetToken;
};

export default mongoose.model<IUser>('User', UserSchema);
