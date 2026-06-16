const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide the certification name'],
      trim: true,
    },
    issuingOrganization: {
      type: String,
      required: [true, 'Please provide the issuing organization'],
      trim: true,
    },
    issueDate: {
      type: Date,
      required: [true, 'Please provide the issue date'],
    },
    expirationDate: {
      type: Date,
    },
    credentialId: {
      type: String,
      trim: true,
      default: '',
    },
    credentialUrl: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Certification = mongoose.model('Certification', certificationSchema);

module.exports = Certification;
