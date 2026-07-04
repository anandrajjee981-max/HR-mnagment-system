import mongoose from "mongoose";

const payrollSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      unique: true,
    },

    basicSalary: {
      type: Number,
      required: true,
      default: 0,
    },

    bonus: {
      type: Number,
      default: 0,
    },

    deduction: {
      type: Number,
      default: 0,
    },

    netSalary: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const payrollmodel= mongoose.model("Payroll", payrollSchema);
export default payrollmodel