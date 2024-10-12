import React, { useEffect, useState } from 'react';
import { useGlobalVariableContext } from '../../Context/GlobalVariableContext'
import { useNavigate } from 'react-router-dom';


function SetForChat(props) {
    //   const { globalVariables, updateGlobalVariables } = useGlobalVariableContext();
    const [name, setName] = useState('')
    const [gender, setGender] = useState(1)
    const navigate = useNavigate();

    // console.log(4, globalVariables.userInfo.user);
    const handleClick = () => {

     //   console.log(66);

        name && navigate('/Chat', {
            state: {
                name: name,
                gender: gender
            }
        });


    }




    return (
        <div>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="text" value={gender} onChange={(e) => setGender(e.target.value)} />
            <button onClick={handleClick}>Go To Chat</button>
        </div>
    );
};

export default SetForChat