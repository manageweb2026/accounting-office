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

     direction: {
      type: String,
      default: "",
    },


     date_recurent: {
      type: String,
      default: "",
    },

     date_limite: {
      type: String,
      default: "",
    },


   
    // السعر الذي يدفعه الزبون
     Prix_Traitement_chifré : {
      type: Number,
      required: true,
      default: 0,
    },

    Prix_Traitement_néant : {
      type: Number,
      required: true,
      default: 0,
    },

      Prix_secretaireC : {
      type: Number,
      required: true,
      default: 0,
    },

    Prix_secretaireN: {
      type: Number,
      required: true,
      default: 0,
    },

     Prix_service_Agent: {
      type: Number,
      required: true,
      default: 0,
    },

    // أجر الموظف
   Prix_Agent: {
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
        "ponctuel",
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