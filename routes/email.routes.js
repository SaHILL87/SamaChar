// import express from "express";
// import sendEmail from "../utils/mail.js";
// const router = express.Router();

// router.post("/send-email", async (req, res) => {
//   const { email, subject, message } = req.body;

//   if (!email || !subject || !message) {
//     return res
//       .status(400)
//       .json({ message: "Please provide all required fields." });
//   }

//   try {
//     await sendEmail(email, subject, message);
//     res.status(200).json({ message: "Email sent successfully" });
//   } catch (error) {
//     console.error("Error sending email:", error);
//     res.status(500).json({ message: "Error sending email" });
//   }
// });

// export default router;
