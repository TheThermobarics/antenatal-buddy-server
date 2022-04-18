const express = require("express");
const {
  getAppointments,
  createAppointment,
  cancelAppointment,
  updateAppointment,
  getAppointmentsByHelper,
  getAppointmentsByMother
} = require("../controllers/appointment");
const { protect } = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");
const Appointment = require("../models/Appointment");

const router = express.Router();

router
  .route("/")
  .get(advancedResults(Appointment, "helper", "mother"), getAppointments)
  .post(protect, createAppointment);

router
  .route("/:id")
  .put(protect, updateAppointment)
  .delete(protect, cancelAppointment);

router
  .route("/getAppointmentsByHelper")
  .post(protect,getAppointmentsByHelper)

router
  .route("/getAppointmentsByMother")
  .post(protect,getAppointmentsByMother)

module.exports = router;