import React, { useEffect, useState } from 'react';
import './AlertStyle.scss'

function Alert({ className, title, msg, autoClose,closeAlert }) {

console.log(2);
  const [showAlert, setShowAlert] = useState(true)

  useEffect(() => {
    // Set up a timeout to hide the alert after 3 seconds
    const timeoutId = setTimeout(() => {
      setShowAlert(false);
    }, 300000);

    // Clear the timeout when the component is unmounted
    return () => clearTimeout(timeoutId);

  }, []); // Empty dependency array ensures the effect runs only once on mount

  useEffect(() => {

  }, [showAlert])

  const handleClose=()=>{
    setShowAlert(false)
    closeAlert()
  }

  return (
    <div className={`alert  alert-${className ? className : 'info'} alert-component 
         ${showAlert === false ? 'alert-component-Noshow' : ''}`}>
      <strong>{title} ! </strong> {msg}
      <i onClick={() => handleClose()} className='fa fa-remove AlertClose'></i>
    </div>
  );
}

export default Alert;