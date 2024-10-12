import React, { useState } from 'react';
import axios from 'axios';
import { useGlobalVariableContext } from '../../Context/GlobalVariableContext';


const EmailSenderFunction = async (emaildata) => {
  const { globalVariables, updateGlobalVariables } = useGlobalVariableContext();

  //console.log(emaildata);
  // const emaildata= {
  //   to: 'yahi1363@gmail.com',
  //   subject: 'subject',
  //   text: 'text',
  // }
 // console.log(5);
  const response=await axios.post(`${globalVariables.urlBase_Server}/api/sendemail`,emaildata);  
 // console.log(response);
  return response
}

export default EmailSenderFunction;




// //send mail
// {
//   const express = require('express');
//   const cors = require('cors');
//   const nodemailer = require('nodemailer');

//   const app = express();
//   app.use(cors());
//   const port = 7000; // Choose any available port

//   app.use(express.json());

//   // Create a Nodemailer transporter
//   const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//           user: 'sedighe.ghanbary@gmail.com', // Your Gmail email address
//           pass: 'cngg bxpd azin taar',    // App password generated for Gmail SMTP
//       },
//   });


//   app.get('/sgh', (req, res) => {
//       res.send({
//           success: true,
//           data: {
//               id: 1,
//               username: '871051',
//               email: 'sedighe.ghanbary@gmail.com',
//               name: 'sedighe',
//               avatar: 'img_avatar.png'
//           }
//       })
//   })

//   // Define a route to send emails
//   app.post('?.map', async (req, res) => {
//       const { to, subject, text } = req.body;

//       if (!to || !subject || !text) {
//           return res.status(400).json({ error: 'Missing required fields in the request body.' });
//         }
      
//       const mailOptions = {
//           from: 'sedighe.ghanbary@gmail.com', // Your Gmail email address
//           to,
//           subject,
//           text,

//       };

//       try {
//           // Send the email
//           const info = await transporter.sendMail(mailOptions);
//           console.log('Email sent:', info);
//           res.status(200).send('Email sent successfully');
//       } catch (error) {
//           console.error('Error sending email:', error);
//           res.status(500).send('Internal Server Error');
//       }
//   });

//   // Start the server
//   app.listen(port, () => {
//       console.log(`Server is running on port ${port}`);
//   });



// }
