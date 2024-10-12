// import { MailSlurp } from 'mailslurp-client';

// const sendEmailWithMailSlurp = async () => {
//   try {
//     // Replace 'YOUR_API_KEY' with your actual MailSlurp API key
//     const apiKey = '5df5d8c3d2b587dc4b1c3831c69794dd6242e2058c874e114824ca1a1a4f00ce';

//     const mailslurp = new MailSlurp({ apiKey });

//     // Create an inbox
//     const inbox = await mailslurp.createInbox();

   
//     // Send an email
//     const sendEmailOptions = {
//       to: ['yahi1363@gmail.com'],
//       subject: 'Test Email',
//       body: '<p>This is a test email sent using MailSlurp in React.</p>',
//     };

//     console.log(sendEmailOptions);
//     // Use await to ensure the email is sent before proceeding
//     const sentEmail = await mailslurp.sendEmail(inbox.id, sendEmailOptions);

//     console.log('Email sent successfully!', sentEmail);
//   } catch (error) {
//     console.error('Error sending ewmail:', error);
//   }
// };

// export default sendEmailWithMailSlurp;
