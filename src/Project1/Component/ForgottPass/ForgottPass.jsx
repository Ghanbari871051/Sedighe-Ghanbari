
import React, { useEffect, useLayoutEffect, useState } from 'react';
import './ForgottPassStyle.scss'
import EmailSenderFunction from '../EmailSender/EmailSenderFunction';
import CRUD from '../../Services/CRUD';
import { useGlobalVariableContext } from '../../Context/GlobalVariableContext';

function ForgottPass(props) {

    const { globalVariables, updateGlobalVariables } = useGlobalVariableContext();

    const [email, setEmail] = useState('')
    const [errorMassage, setErrorMassage] = useState('')
    const handleForgottPass = async () => {

        setErrorMassage('')

        const users = globalVariables.GetData_Mode === 'sql' ?
            await CRUD.SQL_ExecuteQuery('select * from Users', globalVariables.urlBase_Server, false)
            : await CRUD.GetData(`${globalVariables.urlBase_DataBase}/Users`)


        // console.log(users);
        // console.log(email);


        const user = users.find(u => u.email === email)
        // console.log(user);
        //  console.log(458);
        if (user) {
            const emaildata = {
                to: email,
                subject: 'ForgottPass',
                text: `${globalVariables.urlBase_Site}/ChangePass/${user.token}`,
            }
            //   console.log(emaildata);
            const response = EmailSenderFunction(emaildata)
            //   console.log(response);
        }
        else {
            setErrorMassage('Email Not Found')
        }




    }

    return (
        <>
            <div className="forgotPass-component">
                <div className="form-gap"></div>
                <div className="container">
                    <div className="row forgotpass">
                        <div className="col-md-4 col-md-offset-4">
                            <div className="panel panel-default">
                                <div className="panel-body">
                                    <div className="text-center">
                                        <h3><i className="fa fa-lock fa-4x"></i></h3>
                                        <h2 className="text-center">Forgot Password?</h2>
                                        <p>You can reset your password here.</p>
                                        <div className="panel-body">


                                            <div className="form-group">
                                                <div className="input-group">
                                                    <span className="input-group-addon"><i className="glyphicon glyphicon-envelope color-blue"></i></span>
                                                    <input id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email address" className="form-control" type="email" />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                {errorMassage !== '' && <label className='alert alert-danger'>{errorMassage}</label>}
                                                <input disabled name="recover-submit" onClick={handleForgottPass} className="btn btn-lg btn-primary btn-block" value="Reset Password" type="submit" />
                                            </div>

                                            <input type="hidden" className="hide" name="token" id="token" value="" />


                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ForgottPass;