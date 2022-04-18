const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  isApproved: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  additionalInfo: {
    type: String,
  },
  helper: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  mother: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Appointment", AppointmentSchema);