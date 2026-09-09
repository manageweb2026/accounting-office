import { Schema, model, models } from "mongoose";

import "./Client";
import "./Service";
import "./Users";
import "./Modep";

const TaskSchema = new Schema(
  {
    // الزبون
    client: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    // الخدمة
    service: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    // السعر الذي سيدفعه الزبون
    clientPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    // أجر الموظف
    employeePrice: {
      type: Number,
      required: true,
      min: 0,
    },

    // الموظف الذي استلم المهمة
    employee: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // السكرتير الذي أنشأ المهمة
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // تاريخ انتهاء المهمة
    dueDate: {
      type: Date,
      required: true,
    },

    // حالة المهمة
    status: {
      type: String,
      enum: [
        "nouvelle",
        "en_cours",
        "terminee",
        "annulee",
      ],
      default: "nouvelle",
    },

    // ملاحظات
    notes: {
      type: String,
      default: "",
      trim: true,
    },

// هل هذه المهمة دورية؟
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

// هل الاشتراك مازال فعالا؟
recurringActive: {
  type: Boolean,
  default: true,
},

// آخر تنفيذ
lastExecution: {
  type: Date,
  default: null,
},

// موعد التنفيذ القادم
nextExecution: {
  type: Date,
  default: null,
},

    // تاريخ بداية المهمة من الموظف
    assignedAt: {
      type: Date,
      default: null,
    },


    paymentMethod: {
  type: Schema.Types.ObjectId,
  ref: "PaymentMethod",
  required: true,
},



    // تاريخ إنهاء المهمة
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default models.Task || model("Task", TaskSchema)