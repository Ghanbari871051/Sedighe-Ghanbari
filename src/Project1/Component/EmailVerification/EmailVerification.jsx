// EmailVerification.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EmailVerification = ({ match }) => {
  const [verificationStatus, setVerificationStatus] = useState('Verifying...');

  useEffect(() => {
    const { token } = match.params;

    axios.post('/api/verify-email', { token })
      .then(response => {
        setVerificationStatus(response.data.message);
      })
      .catch(error => {
        setVerificationStatus('Error verifying email.');
        console.error(error);
      });
  }, [match.params]);

  return (
    <div>
      <h1>Email Verification</h1>
      <p>{verificationStatus}</p>
    </div>
  );
};

export default EmailVerification;
