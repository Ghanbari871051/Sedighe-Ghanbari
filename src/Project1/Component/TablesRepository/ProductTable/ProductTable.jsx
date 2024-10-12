import React, { useEffect, useLayoutEffect, useState } from 'react';
import DataGrid from '../../DataGridCustom/DataGrid'
import CRUD from '../../../Services/CRUD';
import { useGlobalVariableContext } from '../../../Context/GlobalVariableContext';
import Select from '../../Select/Select';
import Pagination from '../../Pagination/Pagination';
import DataGridTable from '../../DataGrid/DataGridTable';
import Search from '../../Search/Search';
import CRUDModal from '../../DataGridCustom/CRUDModal/CRUDModal';

const ProductTable = () => {

    const { globalVariables, updateGlobalVariables } = useGlobalVariableContext();
    const [sqlCommand_tableData, setSqlCommand_tableData] = useState([])
    const [sqlCommand_tableSchema, setSqlCommand_tableSchema] = useState([])
    const [sqlCommand_tableRelation, setSqlCommand_tableRelation] = useState([])
    const [headerFields_Name, setHeaderFields_Name] = useState([])
    const [headerFields_NoVisible, setHeaderFields_NoVisible] = useState([])
    const [headerFields_NoEnable, setHeaderFields_NoEnable] = useState([])
    const [manageFields, setManageFields] = useState([])
    const [selectOptions_Pagesize, setSelectOptions_Pagesize] = useState([])
    const [Type, setType] = useState('')
    const [refresh, setRefresh] = useState(false)
    const [pagesize, setpagesize] = useState(null)
    const [currentPage, setcurrentPage] = useState(null)
    const [loading, setLoading] = useState(false)

    const API_BaseURL = Type === 'sql' ? globalVariables.urlBase_Server : globalVariables.urlBase_DataBase
    const [showModal, setshowModal] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState()
    const [headerFields, setheaderFields] = useState([])
    const colspan = 4
    const [modalItem, setModalItem] = useState({})


    const tableName = 'product'//table
    const AutoSchema = false
    const SQL_Command_tableData = `SELECT 
         t.ID,
         t.IDForUniq,
         t.ProductID,
         t.Filter_ID,
         t.Filter_Value
       FROM 
         ${tableName} AS t
         for json path`

    const JSON_tableSchema = []
    // [
    //     { "TABLE_NAME": tableName, "COLUMN_NAME": "id", "DATA_TYPE": "int" },
    //     { "TABLE_NAME": tableName, "COLUMN_NAME": "IDForUniq", "DATA_TYPE": "int" },
    //     { "TABLE_NAME": tableName, "COLUMN_NAME": "ProductID", "DATA_TYPE": "int" },
    //     { "TABLE_NAME": tableName, "COLUMN_NAME": "Filter_ID", "DATA_TYPE": "int" },
    //     { "TABLE_NAME": tableName, "COLUMN_NAME": "Filter_Value", "DATA_TYPE": "int" }
    // ]

    const SQL_Command_tableSchema = `SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE 
                        FROM INFORMATION_SCHEMA.COLUMNS
                       where TABLE_NAME='${tableName}'`


    const SQLCommand_RelationData = []
    // [
    //     {
    //         FK_Field: 'ParentIDName',
    //         PK_table: 'mainGroup',
    //         Pk_field: 'parentID',
    //         sqlcommand: `select id,name from mainGroup`
    //     }
    // ]


    const fetchDataSQL = async () => {

        // setLoading(false)
        // //type
        // setType(globalVariables.GetData_Mode)


        // //TableData , tableSchema


        // const mainGroupData = await CRUD.SQL_ExecuteQuery(SQL_Command_tableData, globalVariables.urlBase_Server, true, 90)

        // if (mainGroupData) {
        //     const newItem = mainGroupData?.map(item => {
        //         // const mainGroupFind = mainGroupData.find(ite => ite.id === item.parentID && item.parentID !== null)
        //         // if (mainGroupFind) {
        //         //     item.ParentIDName = mainGroupFind.name
        //         // }
        //         // else {
        //         //     item.ParentIDName = null
        //         // }
        //         return item
        //     })

        //     setSqlCommand_tableData(newItem)
        //     //  setbodyFields(newItem)


        //     if (AutoSchema === true) {
        //         const keys = Object.keys(newItem[0])
        //         const schemaItems = []
        //         keys?.map(itemKey => {
        //             let x = {
        //                 "TABLE_NAME": tableName,
        //                 "COLUMN_NAME": itemKey,
        //                 "DATA_TYPE": "nvarchar"
        //             }
        //             schemaItems.push(x)
        //         })
        //         setSqlCommand_tableSchema(schemaItems)
        //     }
        //     else {
        //         let SchemaData = await CRUD.SQL_ExecuteQuery(SQL_Command_tableSchema, globalVariables.urlBase_Server, false, 100)
        //         if (SchemaData) {
        //             setSqlCommand_tableSchema(SchemaData)
        //         }
        //     }

        // }

        // let relationItems = []
        // SQLCommand_RelationData?.map(async (relation) => {
        //     const relationData = await CRUD.SQL_ExecuteQuery(relation.sqlcommand, globalVariables.urlBase_Server, false, 80)

        //     let relationItems_relatinItem = []
        //     relationData && relationData?.map(item => {
        //         relationItems_relatinItem.push({
        //             id: item.id,
        //             name: item.name
        //         })
        //     })

        //     relationItems.push({
        //         FK_Field: relation.FK_Field,
        //         PK_table: relation.PK_table,
        //         Pk_field: relation.Pk_field,
        //         data: relationItems_relatinItem
        //     })
        // })

        // setSqlCommand_tableRelation(relationItems)

        // setHeaderFields_Name([])
        // // ([
        // //     {
        // //         name: 'ParentIDName',
        // //         headerNameShow: 'ParentIDName'
        // //     }
        // // ])


        // setHeaderFields_NoVisible([])
        // // ([
        // //     {
        // //         name: 'parentID'
        // //     }
        // // ])


        // setHeaderFields_NoEnable([{
        //     name: 'id'
        // }])


        // setManageFields([
        //     { name: 'delete', icon: 'fa fa-remove', status: true },
        //     { name: 'edit', icon: 'fa fa-edit', status: true },
        //     { name: 'view', icon: 'fa fa-eye', status: true }
        // ])

        // setSelectOptions_Pagesize([
        //     { id: 1, num: 5 },
        //     { id: 2, num: 10 },
        //     { id: 3, num: 20 },
        //     { id: 4, num: 50 }
        // ])

        // if (pagesize === null || pagesize === undefined) {
        //     setpagesize({ id: 1, num: 5 })
        //     setcurrentPage(1)
        // }

        // setRefresh(!refresh)
        // setLoading(true)
    }

    const fetchDataJSON = async () => {

        setLoading(false)
        //type
        setType(globalVariables.GetData_Mode)


        //TableData , tableSchema
        Promise.all([
            await CRUD.GetData(`${globalVariables.urlBase_DataBase}/${tableName}`),
            await CRUD.GetData(`${globalVariables.urlBase_DataBase}/Filter_Product`),
            await CRUD.GetData(`${globalVariables.urlBase_DataBase}/Filter_List`),
            await CRUD.GetData(`${globalVariables.urlBase_DataBase}/Filter_Value`),
        ]).then(([productData, Filter_ProductData, filter_ListData, Filter_ValueData]) => {
            if (productData) {
                const newItem = productData?.map(item => {

                    const IDForUniq = Filter_ProductData.find(ite => ite.ProductID === item.id)
                    if (IDForUniq) {
                        item.subGroup = [
                            { ID: 4, IDForUniq: 2, ProductID: 1, Des: 'color:green,size:large' },
                            { ID: 5, IDForUniq: 2, ProductID: 1, Des: 'color:green,size:large' },
                            { ID: 6, IDForUniq: 2, ProductID: 1, Des: 'color:green,size:large' }
                        ]
                    }
                    // item.productTitle = productFind ? productFind.title : null
                    // item.productDescription = productFind ? productFind.description : null
                    // item.productSelectOption = productFind ? productFind.selectOption : null


                    // const Filter_ListFind = filter_ListData.find(ite => ite.filter_id === item.Filter_ID)
                    // item.filterName1 = Filter_ListFind ? Filter_ListFind.filter_name : null

                    // const Filter_ValueFind = Filter_ValueData.find(ite => ite.id === item.Filter_Value)
                    // item.filterValue1 = Filter_ValueFind ? Filter_ValueFind.value : null

                    return item
                })
                console.log(100, newItem);
                setSqlCommand_tableData(newItem)
            }


            // setbodyFields(newItem)

            if (AutoSchema === true) {
                const keys = Object.keys(newItem[0])
                const schemaItems = []
                keys?.map(itemKey => {
                    let x = {
                        "TABLE_NAME": tableName,
                        "COLUMN_NAME": itemKey,
                        "DATA_TYPE": "nvarchar"
                    }
                    schemaItems.push(x)
                })
                setSqlCommand_tableSchema(schemaItems)
            }
            else {
                let SchemaData = JSON_tableSchema
                if (SchemaData) {
                    setSqlCommand_tableSchema(SchemaData)
                }
            }


            //////////////////////////////////////

            let relationItems = []
            SQLCommand_RelationData?.map(async (relation) => {
                const relationData = await CRUD.GetData(`${globalVariables.urlBase_DataBase}/${relation.PK_table}`)

                let relationItems_relatinItem = []
                relationData && relationData?.map(item => {
                    relationItems_relatinItem.push({
                        id: item.id,
                        name: item.name
                    })
                })

                relationItems.push({
                    FK_Field: relation.FK_Field,
                    PK_table: relation.PK_table,
                    Pk_field: relation.Pk_field,
                    data: relationItems_relatinItem
                })

            })
            setSqlCommand_tableRelation(relationItems)

            setHeaderFields_Name([])
            // ([
            //     {
            //         name: 'ParentIDName',
            //         headerNameShow: 'ParentIDName'
            //     }
            // ])


            setHeaderFields_NoVisible([])
            // ([
            //     {
            //         name: 'parentID'
            //     }
            // ])


            setHeaderFields_NoEnable([{
                name: 'id'
            }])


            setManageFields([
                { name: 'delete', icon: 'fa fa-remove', status: true },
                { name: 'edit', icon: 'fa fa-edit', status: true },
                { name: 'view', icon: 'fa fa-eye', status: true }
            ])

            setSelectOptions_Pagesize([
                { id: 1, num: 5 },
                { id: 2, num: 10 },
                { id: 3, num: 20 },
                { id: 4, num: 50 }
            ])

            if (pagesize === null || pagesize === undefined) {
                setpagesize({ id: 1, num: 5 })
                setcurrentPage(1)
            }

            setRefresh(!refresh)
            setLoading(true)
        })
    }

    useEffect(() => {
        globalVariables.GetData_Mode === 'sql' ? fetchDataSQL() : fetchDataJSON()
    }, [])

    useEffect(() => {
    }, [refresh])


    // const handleRefresh = (pagesize, currentPage) => {
    //     setpagesize(pagesize)
    //     setcurrentPage(currentPage)
    //     globalVariables.GetData_Mode === 'sql' ? fetchDataSQL() : fetchDataJSON()
    // }


    const changeSizaPage = (e) => {
        let k = selectOptions_Pagesize.find(ite => ite.id === parseInt(e.target.value))
        setpagesize(k)
        setcurrentPage(1)
        // setChangeFlag(!changeFlag)
    }


    const headerItems = () => {
        const keys = sqlCommand_tableData && sqlCommand_tableData[0] && Object.keys(sqlCommand_tableData[0])
        const k = keys && keys?.map((keyField, index2) => {
            if (keyField != 'subGroup') {
                return <td>{keyField}</td>
            }
        })
        return k
    }

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

    const CreateSubGroup = (subGroup) => {
        const subGroupTds = subGroup?.map((item, index) => {
            let keys = Object.keys(item)
            const k = keys?.map(key => {
                return < td onClick={() => handleItemClick(item)} key={index}> {item[key]}</td>
            })
            return <tr className="intoTable">{k}</tr>;
        });

        // Return the table row (<tr>) containing the table cells
        return subGroupTds
    }

    const handleItemClick = (item) => {
        setSelectedProduct(item)
    }

    const handleRefresh = (pagesize, currentPage) => {
        setpagesize(pagesize)
        setcurrentPage(currentPage)
        fetchDataJSON()
    }

    const createNewItem = () => {
        const NewItemWithType = {}
        const newItem = {}
        sqlCommand_tableSchema && sqlCommand_tableSchema?.map(item => {
            if (item.COLUMN_NAME !== 'id') {
                const propName = item.COLUMN_NAME
                const propType = item.DATA_TYPE
                newItem[propName] = null;
                NewItemWithType[propName] = propType
                //  NewItemWithType.push(...NewItemWithType, { [propType]:  })
            }
        })

        const r = newItem// FakeDataGenerator.FillItemWithData(newItem, NewItemWithType)
        sqlCommand_tableRelation && sqlCommand_tableRelation?.map(item => {
            const propName = item.FK_Field
            r[propName] = null;
        })
        return r
    }

    const handleInsert = () => {
        const newItem = createNewItem()
        setModalItem(newItem)
        setshowModal(true)
    }


    const closeModal = () => {
        //setRefresh_UseState(true)
        setshowModal(false)
        //setFlagRefresh(!FlagRefresh)
    }

    return (
        <>
            45
            {showModal === true && <CRUDModal Type={Type} Tb_Relation={sqlCommand_tableRelation} Tb_schema={sqlCommand_tableSchema} API_BaseURL={API_BaseURL} tableName={tableName} closeModal={closeModal} item={modalItem} manageName={'insert'} headerFields={headerFields} headerFields_Name={headerFields_Name} />}
            {showModal === false && loading === true && <DataGrid
                Type={Type}
                tableName={tableName}
                sqlCommand_tableData={sqlCommand_tableData}
                sqlCommand_tableSchema={sqlCommand_tableSchema}
                sqlCommand_tableRelation={sqlCommand_tableRelation}
                headerFields_Name={headerFields_Name}
                headerFields_NoVisible={headerFields_NoVisible}
                headerFields_NoEnable={headerFields_NoEnable}
                manageFields={manageFields}
                selectOptions_Pagesize={selectOptions_Pagesize}
                handleRefreshParent={handleRefresh}
                FlagRefreshParent={refresh}
                pagesizeParent={pagesize}
                currentPageParent={currentPage}

                handleInsert={handleInsert}
            />
            }
        </>
    )
}

export default ProductTable;