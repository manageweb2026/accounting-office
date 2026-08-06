import { Schema, models, model } from "mongoose";

const ClientSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    contact: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    nif: {
      type: String,
      default: "",
    },

    nis: {
      type: String,
      default: "",
    },

    na: {
      type: String,
      default: "",
    },

    rc: {
      type: String,
      default: "",
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

export default models.Client || model("Client", ClientSchema);