import { Schema, models, model } from "mongoose";

const ClientSchema = new Schema(
  {
    code_client: {
      type: String,
      default: "",
    },


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

     derection: {
      type: String,
      default: "",
    },


     inspection: {
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

    ai: {
      type: String,
      default: "",
    },

    rc: {
      type: String,
      default: "",
    },

     bp: {
      type: String,
      default: "",
    },

     casnos_n: {
      type: String,
      default: "",
    },

     casnos_password: {
      type: String,
      default: "",
    },

     casnos_lieu: {
      type: String,
      default: "",
    },

     cnas_n: {
      type: String,
      default: "",
    },

    cnas_password: {
      type: String,
      default: "",
    },

    cnas_lieu: {
      type: String,
      default: "",
    },


    cacobathph_n: {
      type: String,
      default: "",
    },


    cacobathph_password: {
      type: String,
      default: "",
    },

    cacobathph_lieu: {
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