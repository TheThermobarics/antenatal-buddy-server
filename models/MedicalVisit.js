const mongoose = require("mongoose");

const MedicalVisitSchema = new mongoose.Schema({
  firstVisitDetails: {
    dateOfVisit: {
      type: Date,
    },
    pallor: {
      type: String,
    },
    pulse: {
      type: String,
    },
    rr: {
      type: String,
    },
    bp: {
      type: String,
    },
    weight: {
      type: Number,
    },
    labInvestigationsImg: {
      type: String,
    },
  },
  secondVisitDetails: {
    dateOfVisit: {
      type: Date,
    },
    weight: {
      type: Number,
    },
    sfhMeasurement: {
      type: String,
    },
    labInvestigationsImg: {
      type: String,
    },
  },
  thirdVisitDetails: {
    dateOfVisit: {
      type: Date,
    },
    weight: {
      type: Number,
    },
    preeclampsia: {
      type: String,
    },
    anemia: {
      type: String,
    },
    IUGR: {
      type: String,
    },
    labInvestigationsImg: {
      type: String,
    },
  },
  fourthVisitDetails: {
    dateOfVisit: {
      type: Date,
    },
    weight: {
      type: Number,
    },
    foetalLie: {
      type: String,
    },
    foetalPosition: {
      type: String,
    },
    birthPlanImage: {
      type: String,
    },
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
  visitNumber: {
    type: Number,
    default: 1,
  },
});

module.exports = mongoose.model("MedicalVisit", MedicalVisitSchema);
