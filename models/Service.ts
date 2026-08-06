import { Schema, model, models } from "mongoose";

const ServiceSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    // السعر الذي يدفعه الزبون
    clientPrice: {
      type: Number,
      required: true,
      default: 0,
    },

    // أجر الموظف
    employeePrice: {
      type: Number,
      required: true,
      default: 0,
    },

    // هل هذه الخدمة يمكن أن تكون دورية؟
    isRecurring: {
      type: Boolean,
      default: false,
    },

    // نوع الدورية
    recurrence: {
      type: String,
      enum: [
        "mensuel",
        "trimestriel",
        "semestriel",
        "annuel",
      ],
      default: null,
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

export default models.Service || model("Service", ServiceSchema);