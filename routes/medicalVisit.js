const express = require("express");
const {
  getMedicalVisits,
  createMedicalVisit
} = require("../controllers/medicalVisit");
const { protect } = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");
const MedicalVisit = require("../models/MedicalVisit");

const router = express.Router();

router
  .route("/")
  .get(advancedResults(MedicalVisit), getMedicalVisits)
  .post(protect, createMedicalVisit);


module.exports = router;