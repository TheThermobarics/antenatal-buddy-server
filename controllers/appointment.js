const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const Appointment = require("../models/Appointment");
const dateHelpers = require('../utils/dateHelper');

// @desc      Get all appointments
// @route     GET /api/v1/appointments/
// @access    Protected
exports.getAppointments = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Get all appointments for a doctor/helper
// @route     POST /api/v1/appointments/getAppointmentsByHelper
// @access    Protected
exports.getAppointmentsByHelper = asyncHandler(async (req,res,next) => {
    const { helperId } = req.body;

    if (!helperId) {
        return next(new ErrorResponse("Please provide a helper id", 400));
    }
  
    const appointments = await Appointment.find({"helper":helperId})

    res.status(200).json(appointments)

});

// @desc      Get all appointments for a mother
// @route     POST /api/v1/appointments/getAppointmentsByMother
// @access    Protected
exports.getAppointmentsByMother = asyncHandler(async (req,res,next) => {
    const { motherId } = req.body;

    if (!motherId) {
        return next(new ErrorResponse("Please provide a motherId", 400));
    }
  
    const appointments = await Appointment.find({"mother":motherId})

    res.status(200).json(appointments)

});



// @desc      Create an appointment
// @route     POST /api/v1/appointments/
// @access    Protected
exports.createAppointment = asyncHandler(async (req, res, next) => {
  if (req.body.helper !== req.user.id && req.body.mother !== req.user.id) {
    return next(
      new ErrorResponse(
        "The logged in user and the person creating the appointment are different",
        401
      )
    );
  }

  const { helper, mother, additionalInfo, date, time } = req.body;
  const parsedDate = dateHelpers.createDateFromString(date);

  if (!parsedDate.success) {
      return next(new ErrorResponse('Invalid preferred date', 400));
    }

  const appointment = await Appointment.create(
      {
          helper, 
          mother, 
          additionalInfo, 
          date: parsedDate.data, 
          time
      }
  );

  res.status(200).json({
    success: true,
    data: appointment,
  });
});

// @desc      Update an appointment
// @route     PUT /api/v1/appointments/:id
// @access    Protected
exports.updateAppointment = asyncHandler(async (req, res, next) => {
  let appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    return next(new ErrorResponse("Appointment not found", 404));
  }

  // Match the appointment's doctor/patient with logged in user

  console.log(appointment.helper);
  console.log(req.user.id);
  console.log(String(req.user.id) === String(appointment.helper));

  if (
    String(req.user.id) !== String(appointment.helper) &&
    String(req.user.id) !== String(appointment.mother)
  ) {
    return next(
      new ErrorResponse(
        "The logged in user and the person updating the appointment are different",
        401
      )
    );
  }

  appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  appointment.save();

  res.status(200).json({
    success: true,
    data: appointment,
  });
});

// @desc      Delete an appointment
// @route     DELETE /api/v1/appointments/:id
// @access    Protected
exports.cancelAppointment = asyncHandler(async (req, res, next) => {
  let appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    return next(new ErrorResponse("Appointment not found", 404));
  }

  // Match the appointment's doctor/patient with logged in user

  if (
    String(req.user.id) !== String(appointment.helper) &&
    String(req.user.id) !== String(appointment.mother)
  ) {
    return next(
      new ErrorResponse(
        "The logged in user and the person updating the appointment are different",
        401
      )
    );
  }

  await appointment.remove();
  res.status(200).json({
    success: true,
    data: {},
  });
});