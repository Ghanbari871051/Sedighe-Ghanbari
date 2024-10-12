import React, { useEffect, useState } from 'react';
import CRUD from '../../../Services/CRUD'
import Select from '../../Select/Select';
import { useGlobalVariableContext } from '../../../Context/GlobalVariableContext'

function AddEdit({ Type, Tb_Relation, Tb_schema, API_BaseURL, tableName, type, item, closeModal, headerFields, headerFields_Name }) {

    const [editModalState, setEditModalState] = useState(item)
    const { globalVariables, updateGlobalVariables } = useGlobalVariableContext();
    const handleInputChange = (event) => {
        setEditModalState((prevEditModalState) => ({
            ...prevEditModalState,
            [event.target.name]: !isNaN(parseInt(event.target.value)) ? parseInt(event.target.value) : event.target.value
        }))
    }


    const columnNames = Object.keys(item);

    const CreateField = (field) => {
        const name = headerFields_Name.find(i => i.name === field)
        if (Tb_schema === null) {
            {
                headerFields.find(item => item.key === field).visible === true && (
                    <p key={`FK4${field}`}>
                        {name ? name.headerNameShow : field}:

                        {headerFields.find(item => item.key === field).access === false && <input
                            type="text"
                            name={field}
                            value={editModalState === null ? item[field] : editModalState[field]}
                            onChange={(e) => handleInputChange(e)}
                            disabled
                        />
                        }
                        {headerFields.find(item => item.key === field).access === true &&
                            <input
                                type="text"
                                name={field}
                                value={editModalState === null ? item[field] : editModalState[field]}
                                onChange={(e) => handleInputChange(e)}
                            />
                        }
                    </p>
                )
            }
        }
        else {
            const k = Tb_schema?.map(item => {
                const columnNamesSchema = Object.keys(item);
                if (item['COLUMN_NAME'] === field) {
                    switch (item['DATA_TYPE']) {
                        case 'nvarchar':
                        case 'varchar':
                            return (
                                <div key={`FK1_${field}`} style={{ display: headerFields.find(item => item.key === field)?.visible ? 'block' : 'none' }}>
                                    <p>
                                        {name ? name.headerNameShow : field}:
                                        {headerFields.find(item => item.key === field).access === false &&
                                            <input
                                                type="text"
                                                name={field}
                                                value={editModalState === null ? item[field] : editModalState[field]}
                                                onChange={(e) => handleInputChange(e)}
                                                disabled
                                            />
                                        }
                                        {headerFields.find(item => item.key === field).access === true &&
                                            <input
                                                type="text"
                                                name={field}
                                                value={editModalState === null ? item[field] : editModalState[field]}
                                                onChange={(e) => handleInputChange(e)}

                                            />
                                        }
                                    </p>
                                </div>
                            );
                        case 'int':
                            return (
                                <div key={`FK2_${field}`} style={{ display: headerFields.find(item => item.key === field)?.visible ? 'block' : 'none' }}>
                                    <p>
                                        {name ? name.headerNameShow : field}:
                                        <input
                                            disabled={!headerFields.find(item => item.key === field)?.access}
                                            type="number"
                                            name={field}
                                            value={editModalState === null ? item[field] : editModalState[field]}
                                            onChange={(e) => handleInputChange(e)}
                                        />
                                    </p>
                                </div>
                            );
                    }
                }
            })
            return k
        }
    }


    const createField_FK = (field) => {
        const FK = Tb_Relation.find(i => i.FK_Field === field)
        const name = headerFields_Name.find(i => i.name === field)
        if (FK !== undefined) {
            return <>
                <p>
                    {name ? name.headerNameShow : field}:
                    <Select PkFieldName={FK.Pk_field} selectedDisable={headerFields.find(item => item.key === field).access} selectedID={item.parentID} handleClick={handleInputChange} options={FK.data} selected={editModalState[name ? name.headerNameShow : field]} optionID={'id'} optionValue={'name'} />

                </p>
            </>
        } else {
            return null
        }
    }

    const [FlagRefresh, setFlagRefresh] = useState(false)

    useEffect(() => {
        createField_FK()
    }, [FlagRefresh])

    const showResult = columnNames?.map((field) => {
        if (Tb_Relation && Tb_Relation.find(i => i.FK_Field === field) === undefined) {//if field is not forein key (FK)
            return CreateField(field)
        }

        if (Tb_Relation && Tb_Relation.find(i => i.FK_Field === field) !== undefined) {//if field is forein key (FK)
            return createField_FK(field)
        }
    })


    const AddEditToDB = async () => {
        if (globalVariables.env_mode !== "view") {
            //delete fields that not exist in table fore example FK value
            const editModalStateFiltered = {};
            const itemKeys = Object.keys(item)

            itemKeys.forEach(key => {
                if (Tb_schema.some(i => i.COLUMN_NAME === key)) {
                    editModalStateFiltered[key] = editModalState[key];
                }
            });

            switch (type) {
                case 'edit':
                    if (Type === 'json') {
                        delete editModalStateFiltered.id;
                        await CRUD.AddEditData(item.id, tableName, API_BaseURL, 'edit', editModalStateFiltered)
                    }
                    if (Type === 'sql') {
                        delete editModalStateFiltered.id;
                        CRUD.SQl_Update(item.id, tableName, API_BaseURL, editModalStateFiltered)
                            .then(() => {
                                closeModal();
                            })
                            .catch((error) => {
                                // Handle errors if needed
                                console.error('Error updating data:', error);
                            });
                    }


                    break;


                case 'insert':
                    // Assuming CRUD.SQl_Insert returns a promise
                    if (Type === 'json') {
                        editModalStateFiltered.id = Math.floor(10000 + Math.random() * 90000)
                        await CRUD.AddEditData(null, tableName, API_BaseURL, 'insert', editModalStateFiltered)
                    }
                    if (Type === 'sql') {
                        await CRUD.SQl_Insert(tableName, API_BaseURL, editModalStateFiltered)
                            .then((res) => {
                                const insertedID = res.data.id
                                closeModal();
                            })
                            .catch((error) => {
                                // Handle errors if needed
                                console.error('Error updating data:', error);
                            });
                    }

                    break;

            }
        }
    }

    return (
        <div className="Modal-DataGridComponent">
            <div className='my_modal'>
                <div className="my_modal-content">
                    <a href="" onClick={() => closeModal()}> <i className='fa fa-close close'></i></a>
                    <h2>{type === 'edit' ? 'Edit' : 'Insert'}</h2>
                    {type === 'edit' && <p>Id:{item.id}</p>}
                    {showResult}
                    <br />

                    <button onClick={() => AddEditToDB()}>{type === 'edit' ? 'Edit' : 'Insert'}</button>
                    <button onClick={() => closeModal()}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default AddEdit;