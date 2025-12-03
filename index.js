import express from "express";
const app = express();
const port = 3000;
import dotenv from "dotenv";
import nodemailer from "nodemailer";
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
  //Email notification
//    const transporter = nodemailer.createTransport({
//      service: "gmail",
//      auth: {
//        user: process.env.GMAIL_USER,
//        pass: process.env.GMAIL_PASS,
//      },

//    });
//    await transporter.sendMail({
//      from: process.env.GMAIL_USER,
//      to: process.env.MY_EMAIL, // where YOU receive notifications
//      subject: "New message from portfolio",
//      text: `Name: ${full_name}\nEmail: ${email}\nMessage:\n${message}`,
//    });
   
    res.status(200).json({ message: "Notification sent successfully" });

   } catch (error) {
    
    console.error("Error sending notification:", error);
    res.status(500).json({ error: "Failed to send notification" });
   }

})
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
