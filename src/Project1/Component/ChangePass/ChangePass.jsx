// ChangePass.js

import React, { useState } from 'react';
import { useGlobalVariableContext } from '../../Context/GlobalVariableContext';
import CRUD from '../../Services/CRUD';
import { useParams } from 'react-router-dom';

const ChangePass = ({ match }) => {
    const { globalVariables, updateGlobalVariables } = useGlobalVariableContext();

    const [password, setPassword] = useState('');
    const [errorMassage, setErrorMassage] = useState('')
    const { token } = useParams();
    const handleResetPassword = async () => {
        try {

            let users = globalVariables.GetData_Mode === 'sql' ?
                await CRUD.SQL_ExecuteQuery('select * from Users', globalVariables.urlBase_Server, false)
                : await CRUD.GetData(`${globalVariables.urlBase_DataBase}/Users`)

            const user = users && users.find(u => u.token === token)
            if (user) {
                user.password = password
                const response = CRUD.AddEditData(user.id, 'Users', globalVariables.urlBase_DataBase, 'edit', user)
                // console.log(response);
                //  console.log('Password Changed');
            }
            else {
                setErrorMassage('User Not Found')
            }
        } catch (error) {
            console.error('Error resetting password:', error);
        }
    };

    return (
        <div>
            <h2>Reset Password</h2>
            <label>New Password:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleResetPassword}>Reset Password</button>
        </div>
    );
};

export default ChangePass;