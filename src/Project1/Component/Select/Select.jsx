import React, { useEffect, useState } from 'react';
import './SelectStyle.scss'

function Select({ className, options, handleClick, selectedID, PkFieldName, selectedDisable, optionID, optionValue }) {

   // console.log(8000,options,selectedID,optionValue);
    const [selectedItemId, setSelectedItem] = useState(selectedID);
    const handleChange = (event) => {
        setSelectedItem(event.target.value)
        handleClick(event)
    }


    const showOptions = options?.map(item => {
        return <option key={item[optionID]} value={item[optionID]}>
            {item[optionValue]}
        </option>
    })

    if (selectedDisable === false) {
        return (
            <div className={`select-component ${className}`}>
                <select disabled onChange={(e) => handleChange(e)} name={PkFieldName} value={selectedItemId} className="form-select my-select">
                    {showOptions}
                </select>
            </div>
        )
    }
    else {
        return (
            <div className={`select-component ${className}`}>
                <select onChange={(e) => handleChange(e)} name={PkFieldName} value={selectedItemId} className="form-select my-select">
                    {showOptions}
                </select>
            </div>
        )
    }
}

export default Select;