import { Schema, model, models } from "mongoose";

import "./Client";
import "./Service";
import "./Users";
import "./Modep";

const ServicesSchema = new Schema(
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

   

    // السكرتير الذي أنشأ المهمة
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // تاريخ  المهمة
    datePayement: {
      type: Date,
      required: true,
    },

    // حالة المهمة
    active: {
      type: Boolean,
        default: true,
    },




    paymentMethod: {
  type: Schema.Types.ObjectId,
  ref: "PaymentMethod",
  required: true,
},



  },
  {
    timestamps: true,
  }
);

export default models.ServicesClient || model("ServicesClient", ServicesSchema)