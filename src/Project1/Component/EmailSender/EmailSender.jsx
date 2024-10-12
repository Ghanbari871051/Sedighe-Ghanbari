import React, { useState } from 'react';
import EmailSenderFunction from './EmailSenderFunction'

function EmailSender(props) {

  const [emailData, setEmailData] = useState({
    to: 'yahi1363@gmail.com',
    subject: 'subject',
    text: 'text',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmailData({ ...emailData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //   try {
    //  console.log(emailData);
    const response = await EmailSenderFunction(emailData)
   // console.log(response.data);
    // } catch (error) {
    //   console.error("AxiosError:", error);
    // }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        To:
        <input type="email" name="to" value={emailData.to} onChange={handleInputChange} />
      </label>
      <label>
        Subject:
        <input type="text" name="subject" value={emailData.subject} onChange={handleInputChange} />
      </label>
      <label>
        Message:
        <textarea name="text" value={emailData.text} onChange={handleInputChange} />
      </label>
      <button type="submit">Send Email</button>
    </form>
  );

}

export default EmailSender;