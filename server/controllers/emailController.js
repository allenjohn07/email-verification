const EmailModel = require("../models/EmailVerify");
const randomstring = require("randomstring");
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");

//function to add the email in the database
const addEmail = async (req, res) => {
  const { email } = req.body;
  try {
    //creating otp using random string
    const otp = randomstring.generate({
      length: 6,
      charset: "numeric",
    });

    //checking if user exists
    const user = await EmailModel.findOne({ email });
    if (user) {
      if (user.isVerified === true) {
        return res.json({
          message: "Email already verified",
        });
      }
      const updatedUser = await EmailModel.updateOne(
        { email },
        {
          $set: {
            otp,
          },
        }
      );
    } else {
      //creating new user
      const newuser = await EmailModel.create({
        email,
        otp,
        isVerified: false,
      });
    }

    // console.log(newuser);

    //send mail using nodemailer
    let config = {
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    };

    let transporter = nodemailer.createTransport(config);

    //template for generating mail content
    let MAilGenerator = new Mailgen({
      theme: "default",
      product: {
        name: "Cream Bun",
        link: "https://www.google.com/search?q=cream+bun&oq=cream+bun&gs_lcrp=EgZjaHJvbWUqEAgAEAAYgwEY4wIYsQMYgAQyEAgAEAAYgwEY4wIYsQMYgAQyDQgBEC4YgwEYsQMYgAQyBwgCEAAYgAQyCggDEAAYyQMYgAQyCggEEAAYkgMYgAQyBggFEEUYPDIGCAYQRRg8MgYIBxBFGD3SAQg3MDI1ajBqN6gCALACAA&sourceid=chrome&ie=UTF-8",
      },
    });

    let emailTemplate = {
      body: {
        name: email,
        intro:
          "Welcome to Email Verification! We're very excited to verify your account!!!.",
        action: {
          instructions:
            "To get started with verification, please use the code below:",
          button: {
            color: "#22BC66", // Optional action button color
            text: otp,
          },
        },
        outro:
          "Need help, or have questions? Just reply to this email, we'd love to help.",
      },
    };

    //generating the email with the above details by passing it to MailGenerator
    let emailBody = MAilGenerator.generate(emailTemplate);

    let message = {
      from: process.env.EMAIL,
      to: email,
      subject: "Email Verification",
      //passing the emailBody as the html
      html: emailBody,
    };

    //sending the mail using sendMail by passing the above message
    transporter
      .sendMail(message)
      .then(() => {
        return res.json({
          message: "Email sent successfully",
        });
      })
      .catch((error) => {
        return res.status(501).json({
          error,
        });
      });
  } catch (error) {
    console.log(error);
  }
};

//function to verify the otp
const verifyOTP = async (req, res) => {
  const { email, token } = req.body;
  try {
    const emailtoVerify = await EmailModel.findOne({email})
    if(!emailtoVerify){
      return res.json({
        message: 'Email does not exist'
      })
    }

    if(emailtoVerify.otp !== token){
      return res.json({
        message: 'Incorrect OTP'
      })
    }

    const updatedUser = await EmailModel.updateOne({email},{
      $set:{
        isVerified: true
      }
    })

    res.json({
      message: 'Verified Successfully!'
    })

  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addEmail,
  verifyOTP
};
