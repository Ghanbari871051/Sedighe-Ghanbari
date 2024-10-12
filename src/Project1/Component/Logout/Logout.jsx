import React from 'react';
import { useGlobalVariableContext } from '../../Context/GlobalVariableContext';
function Logout(props) {

    const { globalVariables, updateGlobalVariables } = useGlobalVariableContext();
    const handleLogout = () => {

        localStorage.removeItem('token')
        updateGlobalVariables({
            userInfo: {
                user: {},
                token: ''
            }
        });
    }

    return (
        <button type="button" onClick={handleLogout} className="btn btn-warning">Sign-Out</button>

    );
}

export default Logout;