const mongoose = require("mongoose");

const EmailVerifySchema = mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  otp: {
    type: Number,
    required: true
  },
  isVerified: {
    type: Boolean,
  },
});

const EmailModel = mongoose.model("useremails", EmailVerifySchema);

module.exports = EmailModel;
