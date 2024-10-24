import nodemailer from "nodemailer";
import User from "../models/User.js";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user:'ngenx2831@gmail.com',
    pass: 'iwakxdrxopazhwtl',
  },
});

const sendEmail = async (to, subject, message) => {
  try {
    const info = await transporter.sendMail({
      from: {
        name: "SamaChar",
        address: process.env.SMTP_USER,
      },
      to,
      subject,
      text: message,
    //   attachments: [
    //     {
    //       filename: 'image1.jpg',  // File name that will appear in the email
    //       path: './path-to-image/image1.jpg',  // Local or remote path to the image
    //       cid: 'image1'  // Content ID to reference the image in the HTML if needed
    //     },
    //     {
    //       filename: 'image2.png',
    //       path: './path-to-image/image2.png',
    //       cid: 'image2'
    //     }
    //   ],
    });

    console.log("Email sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email: ", error);
    throw error;
  }
};

export default sendEmail;
