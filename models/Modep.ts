import mongoose, { Schema, Document } from "mongoose";

export interface IPaymentMethod extends Document {
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentMethodSchema = new Schema<IPaymentMethod>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.PaymentMethod ||
  mongoose.model<IPaymentMethod>("PaymentMethod", PaymentMethodSchema);