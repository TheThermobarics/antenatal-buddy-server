const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const MedicalVisit = require("../models/MedicalVisit");
const dateHelpers = require("../utils/dateHelper");

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
  const { mother, helper, dateOfVisit } = req.body;
  if (req.body.helper !== req.user.id && req.body.mother !== req.user.id) {
    return next(
      new ErrorResponse(
        "The logged in user and the person creating the appointment are different",
        401
      )
    );
  }

  const parsedDate = dateHelpers.createDateFromString(dateOfVisit);

  if (!parsedDate.success) {
    return next(new ErrorResponse("Invalid preferred date", 400));
  }

  let existingMedicalVisit = await MedicalVisit.findOne({
    mother: mother,
    helper: helper,
  });

  if (!existingMedicalVisit) {
    const { pallor, pulse, rr, bp, weight, labInvestigationsImg } = req.body;

    const medicalVisit = await MedicalVisit.create({
      helper,
      mother,
      visitNumber: 1,
      firstVisitDetails: {
        dateOfVisit: parsedDate.data,
        pallor,
        pulse,
        rr,
        bp,
        weight,
        labInvestigationsImg,
      },
    });

    res.status(200).json({
      success: true,
      data: medicalVisit,
    });
  }

  if (existingMedicalVisit) {
    if (existingMedicalVisit.visitNumber === 1) {
      const { weight, sfhMeasurement, labInvestigationsImg } = req.body;
      if (!weight || !sfhMeasurement || !labInvestigationsImg) {
        return next(
          new ErrorResponse("PLease send data pertaining to 2nd visit", 400)
        );
      }

      updatedMedicalVisit = await MedicalVisit.findByIdAndUpdate(
        existingMedicalVisit._id,
        {
          visitNumber: 2,
          secondVisitDetails: {
            dateOfVisit: parsedDate.data,
            weight,
            sfhMeasurement,
            labInvestigationsImg,
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );
      await updatedMedicalVisit.save();

      res.status(200).json({
        success: true,
        data: updatedMedicalVisit,
      });
    } else if (existingMedicalVisit.visitNumber === 2) {
      const { weight, preeclampsia, anemia, IUGR, labInvestigationsImg } =
        req.body;

      if (
        !weight ||
        !preeclampsia ||
        !anemia ||
        !IUGR ||
        !labInvestigationsImg
      ) {
        return next(
          new ErrorResponse("PLease send data pertaining to 3rd visit", 400)
        );
      }

      updatedMedicalVisit = await MedicalVisit.findByIdAndUpdate(
        existingMedicalVisit._id,
        {
          visitNumber: 3,
          thirdVisitDetails: {
            dateOfVisit: parsedDate.data,
            weight,
            preeclampsia,
            anemia,
            IUGR,
            labInvestigationsImg,
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );
      await updatedMedicalVisit.save();

      res.status(200).json({
        success: true,
        data: updatedMedicalVisit,
      });
    } else if (existingMedicalVisit.visitNumber === 3) {
      const { weight, foetalLie, foetalPosition, birthPlanImage } = req.body;

      if (!weight || !foetalLie || !foetalPosition || !birthPlanImage) {
        return next(
          new ErrorResponse("PLease send data pertaining to 4th visit", 400)
        );
      }

      updatedMedicalVisit = await MedicalVisit.findByIdAndUpdate(
        existingMedicalVisit._id,
        {
          visitNumber: 4,
          fourthVisitDetails: {
            dateOfVisit: parsedDate.data,
            weight,
            foetalLie,
            foetalPosition,
            birthPlanImage,
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );
      await updatedMedicalVisit.save();

      res.status(200).json({
        success: true,
        data: updatedMedicalVisit,
      });
    } else {
      res.status(200).json({
        success: false,
        data: "Max number of ANC visits reached",
      });
    }
  }
});
