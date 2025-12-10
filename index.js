import express from "express";
const app = express();
const port = 3000;
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { Resend } from "resend";
import twilio from "twilio";
import cors from "cors";
import fs from "fs";

dotenv.config();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});
const client = twilio(process.env.accountSid, process.env.authToken);
app.post('/api/v1/notify', async (req,res)=>{
   try {
     const { email,full_name, message } = req.body;
    if(!email){
        return res.status(400).json({ error: "Email is required" });
    }
//whats APP notification
client.messages
  .create({
    from: process.env.whatsappNumberfrom,
    body: `New portfolio contact:\nName: ${full_name}\nEmail: ${email}\nMessage: ${message}`,
    to: process.env.whatsappNumberto,
  })
  .then((message) => console.log(message))
fs.appendFileSync(
  "contacts.txt",
  `Date: ${new Date().toLocaleString()}  \n Name: ${full_name},\n Email: ${email},\n Message: ${message}\n\n\n\n`
);
  // Email notification
  //  const transporter = nodemailer.createTransport({
  //    host: "smtp.gmail.com",
  //    port: 465,
  //    secure: true, 
  //    auth: {
  //      user: process.env.GMAIL_USER,
  //      pass: process.env.GMAIL_PASS,
  //    },
  //    auth: {
  //      user: process.env.GMAIL_USER,
  //      pass: process.env.GMAIL_PASS,
  //    },
  //  });
  //  await transporter.sendMail({
  //    from: process.env.GMAIL_USER,
  //    to: process.env.MY_EMAIL, // where YOU receive notifications
  //    subject: "New message from portfolio",
  //    text: `New Portfolio contact\n  Name: ${full_name}\nEmail: ${email}<mark>\nMessage:\n${message}`,
  //  });
   

   const resend = new Resend(process.env.resendpass);

   resend.emails.send({
     from: "portfolio contact   <onboarding@resend.dev>",
     to: "banothsujith4@gmail.com",
     subject: "New ProtFolio Contact",
     html: `<p>New Portfolio contact....!</p> <p>Name: ${full_name} </p> <p><b><mark>Email: ${email}</mark></b></p> <p>Message:${message}</p> `,
   });
    res.status(200).json({ message: "Notification sent successfully" });

   } catch (error) {
    
    console.error("Error sending notification:", error);
    res.status(500).json({ error: "Failed to send notification" });
   }

})
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
