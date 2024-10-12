import React from 'react';
import { useState } from 'react';
import DataGridTable from './DataGridTable';
import { faker } from '@faker-js/faker';
import CRUDModal from './CRUDModal/CRUDModal';


function DataGridBody({ Type, currentPage,pagesize, Tb_Relation, Tb_schema, EndPointAPI, API_BaseURL, tableName, mainData, bodyFields, headerFields, manageFields, tableID, handleRefresh, handleSort, headerFields_Name }) {
    //  console.log(231,tableID, headerFields,Tb_schema);
    const show_expand = true
    const keys = bodyFields[0] && Object.keys(bodyFields[0])
    const colspan = 4
    const [showModal, setshowModal] = useState(false)
    const [modalItem, setModalItem] = useState({})
    const [ModalmanageName, setModalmanageName] = useState('')

    const handleManageFields = (item, manageName) => {
        const selectedItem = mainData.find(ite => ite.id === item.id)
        setModalItem(selectedItem)
        setModalmanageName(manageName)
        setshowModal(true)
    }

    const closeModal = () => {
        setshowModal(false)
        handleRefresh()
    }


    const createMainList = (id) => {
        try {
            if (mainData) {
                const data = []
                data.push(mainData.find(item => item.id === id)['subGroup'])
                return mainData.find(item => item.id === id)['subGroup']
            }
        }
        catch {
            return null
        }
    }

    const getSubGroup_body = (id) => {
        try {
            if (mainData) {
                return mainData.find(item => item.id === id).subGroup
            }
        }
        catch {
            return null
        }
    }


    const getSubGroup_header = (id) => {
        try {
            if (mainData) {
                const columnNames = Object.keys(((mainData.find(item => item.id === id)['subGroup']))[0]);
                const element = []
                const header = { key: 'no', name: null, access: true, visible: true }
                element.push(header);
                for (let index = 0; index < columnNames.length; index++) {
                    if (columnNames[index] === 'subGroup') {
                        const header = {
                            key: columnNames[index],
                            name: columnNames[index],
                            access: true,
                            visible: false
                        }
                        element.push(header);
                    }
                    else {
                        const header = {
                            key: columnNames[index],
                            name: columnNames[index],
                            access: true,
                            visible: true
                        }
                        element.push(header);
                    }
                }
                return element
            }
        }
        catch {
            return null
        }
    }


    const manageFields2 = [
        { name: 'delete', icon: 'fa fa-remove', status: false },
        { name: 'edit', icon: 'fa fa-edit', status: false },
        { name: 'view', icon: 'fa fa-eye', status: false }
    ]

    const handleIcon = (e) => {
        if (e.target.className.includes('fa fa-angle-right') === true) {
            e.target.className -= ' fa fa-angle-right'
            e.target.className += ' collapsed fa fa-angle-down'
        }
        else {
            e.target.className -= ' collapsed fa fa-angle-down'
            e.target.className += ' fa fa-angle-right'
        }
    }


    const bodyItems = bodyFields?.map((item, index) => {
        if (item !== undefined) {
           // if (showModal === false) {
                let is_first = true
                let have_sub = item.subGroup === undefined ? false : true

                return <React.Fragment key={`s${item.id}`}>
                    <tr className={`${tableID}JS_no-sub sgh1`} key={`s${index}`} >
                        <td>
                            {manageFields?.map((manage, index) => {
                                if (manage.status) {
                                    return <a key={`ss${index}`} href='#'> <i onClick={() => handleManageFields(item, manage.name)} className={manage.icon}></i></a>
                                }
                            })}
                            {have_sub === true && <a key={`sss${index}`}>
                                <i id={`i${tableID}${index}`} onClick={(e) => handleIcon(e)} className='fa fa-angle-right' data-bs-toggle="collapse" data-bs-target={`#n${tableID}${index}`}></i>
                            </a>
                            }
                        </td>
                        {keys && keys?.map((keyField, index2) => {
                            if (headerFields && headerFields.filter(x => x.key === keyField)[0] && headerFields.filter(x => x.key === keyField)[0].access === true) {
                                if (headerFields.filter(x => x.key === keyField)[0].visible === true) {
                                    return <td key={`ssss${index2}`}>{item[keyField]}</td>
                                }
                            }
                        })}
                    </tr>

                    {show_expand === true &&
                        <React.Fragment key={`n${tableID}${item.id}`}>

                            <tr className="collapse sgh2  navigation-collapse" key={`n${tableID}${index}`} id={`n${tableID}${index}`}>
                                <td colSpan={colspan + 2}>
                                    <tr className="intoTable">
                                        <DataGridTable
                                            intoGrid={true}
                                            pagesize={pagesize}
                                            currentPage={currentPage}
                                            tableID={`tableGrid${faker.string.uuid()}`}
                                            bodyFields={getSubGroup_body(item.id)}
                                            headerFields={getSubGroup_header(item.id)}
                                            manageFields={manageFields2}
                                            mainData={createMainList(item.id)}
                                        />
                                    </tr>
                                </td>
                            </tr>
                        </React.Fragment>
                    }
                </React.Fragment>
          //  }
        }
    })


    return (
        <>
            {bodyItems}
            {showModal === true && <CRUDModal Type={Type} Tb_Relation={Tb_Relation} Tb_schema={Tb_schema} EndPointAPI={EndPointAPI} API_BaseURL={API_BaseURL} tableName={tableName} closeModal={closeModal} item={modalItem} manageName={ModalmanageName} headerFields={headerFields} headerFields_Name={headerFields_Name} />}
            {/* {flagOfManage === false && bodyItems} */}
        </>
    );
}

export default DataGridBody;



// const bodyFields2 = [
//         { expand: false, ostan: "tehran", city: "pakdasht" },
//         { expand: false, ostan: "kerman", city: "bam" },
//         { expand: false, ostan: "zanjan", city: "zanjan" },
//     ]

// const headerFields2 = [
//     { key: "no", name: null, access: true, visible: true },
//     { key: "id", name: "id", access: true, visible: true },
//     { key: "name1", name: "name1", access: true, visible: true },
//     { key: "text1", name: "text1", access: true, visible: false }
// ]