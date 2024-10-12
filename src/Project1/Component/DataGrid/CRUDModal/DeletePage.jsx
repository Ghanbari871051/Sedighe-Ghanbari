import React, { useState } from 'react';
import CRUD from '../../../Services/CRUD'
import { useGlobalVariableContext } from  '../../../Context/GlobalVariableContext'

function Delete({ Type, EndPointAPI, API_BaseURL, tableName, item, closeModal, headerFields_Name }) {

    const columnNames = Object.keys(item);
    const { globalVariables, updateGlobalVariables } = useGlobalVariableContext();

    const showResult = columnNames?.map((field, index) => {
        if (Array.isArray(item[field]) === false) {
            const name = headerFields_Name.find(i => i.name === field)
            return <p key={`${item[field]}${index}`}>{name ? name.headerNameShow : field}:{item[field]}</p>
        }
    })

    const handleDelete = async () => {
        if (globalVariables.env_mode !== "view") {
            if (Type === 'json') {
                await CRUD.DeleteData(item.id, tableName, API_BaseURL);
            }
            if (Type === 'sql') {
                await CRUD.SQL_ExecuteQuery(`DELETE FROM ${tableName} WHERE id=${item.id}`, API_BaseURL, EndPointAPI)
            }
            closeModal();
        }
    }


    return (
        <div className="Modal-DataGridComponent">
            <div className='my_modal'>
                <div className="my_modal-content">
                    <a href="" onClick={() => closeModal()}> <i className='fa fa-close close'></i></a>
                    <h2>delete</h2>
                    {showResult}
                    <br />
                    <br />
                    Are you sure for Delete Item?
                    <button onClick={() => handleDelete()}>Yes,Delete</button>
                    <button onClick={() => closeModal()}>No,Cancel</button>
                </div>
            </div>
        </div >
    );
}

export default Delete;