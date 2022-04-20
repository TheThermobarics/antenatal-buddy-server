const express = require("express");
const {
  getMedicalVisits,
  createMedicalVisit,
  getdoctorWiseVisit,
} = require("../controllers/medicalVisit");
const { protect } = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");
const MedicalVisit = require("../models/MedicalVisit");

const router = express.Router();

router
  .route("/")
  .get(advancedResults(MedicalVisit, "mother"), getMedicalVisits)
  .post(protect, createMedicalVisit);

router.route("/doctorWiseVisit").post(protect, getdoctorWiseVisit);

module.exports = router;
