const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const MedicalVisit = require("../models/MedicalVisit");

// @desc      Get all medical visits
// @route     GET /api/v1/medicalVisits/
// @access    Protected
exports.getMedicalVisits = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Create a medical visit
// @route     POST /api/v1/medicalVisits/
// @access    Protected
exports.createMedicalVisit = asyncHandler(async (req, res, next) => {
    const { mother, helper } = req.body;
  if (req.body.helper !== req.user.id && req.body.mother !== req.user.id) {
    return next(
      new ErrorResponse(
        "The logged in user and the person creating the appointment are different",
        401
      )
    );
  }

  let existingMedicalVisit = await MedicalVisit.findOne({mother:mother, helper: helper})

  if(!existingMedicalVisit){
    const medicalVisit = await MedicalVisit.create(req.body);

    res.status(200).json({
        success: true,
        data: medicalVisit,
    });
  }

  if(existingMedicalVisit){
    updatedMedicalVisit = await MedicalVisit.findByIdAndUpdate(existingMedicalVisit._id, {...req.body, visitNumber: existingMedicalVisit.visitNumber+1}, {
        new: true,
        runValidators: true,
    });
    await updatedMedicalVisit.save();

    res.status(200).json({
        success: true,
        data: updatedMedicalVisit,
    });
  }

  

  
});