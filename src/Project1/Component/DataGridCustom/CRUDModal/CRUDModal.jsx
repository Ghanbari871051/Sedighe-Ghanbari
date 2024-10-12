import React from 'react';
import './Modal.scss'
import DeletePage from './DeletePage.jsx';
import AddEditPage from './AddEditPage.jsx';
import ViewPage from './ViewPage.jsx';

function CRUDModal({Type, Tb_Relation, Tb_schema, EndPointAPI, API_BaseURL, tableName, item, manageName, closeModal, headerFields, headerFields_Name }) {
    // console.log(33, Tb_Relation, Tb_schema);
    const DeleteModal = () => {
        return <DeletePage Type={Type} EndPointAPI={EndPointAPI} API_BaseURL={API_BaseURL} tableName={tableName} item={item} closeModal={closeModal} headerFields_Name={headerFields_Name} />
    }

    const Add_EditModal = (type) => {
        return <AddEditPage Type={Type} Tb_Relation={Tb_Relation} Tb_schema={Tb_schema} EndPointAPI={EndPointAPI} API_BaseURL={API_BaseURL} tableName={tableName} type={type} item={item} closeModal={closeModal} headerFields={headerFields} headerFields_Name={headerFields_Name} />
    }

    const ViewModal = () => {
        return <ViewPage item={item} closeModal={closeModal} headerFields_Name={headerFields_Name} />
    }



    switch (manageName) {
        case 'delete':
            return DeleteModal()

        case 'edit':
            return Add_EditModal('edit')

        case 'view':
            return ViewModal()

        case 'insert':
            return Add_EditModal('insert')
    }

}



export default CRUDModal;
