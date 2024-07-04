const express = require('express')
const { addEmail, verifyOTP } = require('../controllers/emailController')
const router = express.Router()

//route to add the email and otp to the db
router.post('/addEmail', addEmail)

//route to verify the otp send via email
router.post('/verifyOtp', verifyOTP)

module.exports = router