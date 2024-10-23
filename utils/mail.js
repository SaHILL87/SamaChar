// import nodemailer from "nodemailer";
// import User from "../models/User";
// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// });

// const sendEmail = async (to, subject, message) => {
//   try {
//     const info = await transporter.sendMail({
//       from: {
//         name: "SamaChar",
//         address: process.env.SMTP_USER,
//       },
//       to,
//       subject,
//       text: message,
//     });

//     console.log("Email sent: %s", info.messageId);
//   } catch (error) {
//     console.error("Error sending email: ", error);
//     throw error;
//   }
// };

// export default sendEmail;
