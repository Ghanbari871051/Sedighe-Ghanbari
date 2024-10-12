import React, { useEffect, useLayoutEffect, useState } from 'react';
import DataGrid from '../../DataGrid/DataGrid'
import CRUD from '../../../Services/CRUD';
import { useGlobalVariableContext } from '../../../Context/GlobalVariableContext';

const MainGroupTable = () => {

    console.log(777);
    
    const { globalVariables, updateGlobalVariables } = useGlobalVariableContext();
    const tableName = 'mainGroup'//table
    const AutoSchema = false
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

    const SQL_Command_tableData = `SELECT 
         mg.id,
         mg.name,
         mg.name_Italy,
         mg.name_japan,
         mg.parentID,
         (SELECT name FROM mainGroup WHERE id = mg.parentID) AS ParentIDName
      FROM 
         mainGroup AS mg
         for json path`


    const JSON_tableSchema = [
        {
            "TABLE_NAME": "mainGroup",
            "COLUMN_NAME": "id",
            "DATA_TYPE": "int"
        },
        {
            "TABLE_NAME": "mainGroup",
            "COLUMN_NAME": "name",
            "DATA_TYPE": "nvarchar"
        },
        {
            "TABLE_NAME": "mainGroup",
            "COLUMN_NAME": "name_Italy",
            "DATA_TYPE": "nvarchar"
        },
        {
            "TABLE_NAME": "mainGroup",
            "COLUMN_NAME": "name_japan",
            "DATA_TYPE": "nvarchar"
        },
        {
            "TABLE_NAME": "mainGroup",
            "COLUMN_NAME": "parentID",
            "DATA_TYPE": "int"
        },
    ]

    const SQL_Command_tableSchema = `SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE 
                        FROM INFORMATION_SCHEMA.COLUMNS
                       where TABLE_NAME='${tableName}'`


    const SQLCommand_RelationData = [
        {
            FK_Field: 'ParentIDName',
            PK_table: 'mainGroup',
            Pk_field: 'parentID',
            sqlcommand: `select id,name from mainGroup`
        }
    ]


    const fetchData = async () => {

        //type
        setType(globalVariables.GetData_Mode)


        //TableData , tableSchema


        const mainGroupData = globalVariables.GetData_Mode === 'sql' ?
            await CRUD.SQL_ExecuteQuery(SQL_Command_tableData, globalVariables.urlBase_Server, true, 90)
            : await CRUD.GetData(`${globalVariables.urlBase_DataBase}/${tableName}`)

        if (mainGroupData) {
            const newItem = mainGroupData?.map(item => {
                const mainGroupFind = mainGroupData.find(ite => ite.id === item.parentID && item.parentID !== null)
                if (mainGroupFind) {
                    item.ParentIDName = mainGroupFind.name
                }
                else {
                    item.ParentIDName = null
                }
                return item
            })

            setSqlCommand_tableData(newItem)


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
                let SchemaData = globalVariables.GetData_Mode === 'sql' ?
                    await CRUD.SQL_ExecuteQuery(SQL_Command_tableSchema, globalVariables.urlBase_Server, false, 100)
                    : JSON_tableSchema
                if (SchemaData) {
                 //   console.log(4000, SchemaData);
                    setSqlCommand_tableSchema(SchemaData)
                }
            }

        }

        let relationItems = []
        SQLCommand_RelationData?.map(async (relation) => {
            const relationData = globalVariables.GetData_Mode === 'sql' ?
                await CRUD.SQL_ExecuteQuery(relation.sqlcommand, globalVariables.urlBase_Server, false, 80)
                : await CRUD.GetData(`${globalVariables.urlBase_DataBase}/${relation.PK_table}`)

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

        setHeaderFields_Name([
            {
                name: 'ParentIDName',
                headerNameShow: 'ParentIDName'
            }
        ])


        setHeaderFields_NoVisible([
            {
                name: 'parentID'
            }
        ])

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
    }


    useEffect(() => {
        setLoading(false)
        fetchData().then(() => {
            setLoading(true)
        })
    }, [])

    useEffect(() => {
    }, [refresh, loading, globalVariables.GetData_Mode])


    const handleRefresh = (pagesize, currentPage) => {
        setpagesize(pagesize)
        setcurrentPage(currentPage)
        fetchData()
    }

    return (
        <>
            {loading === true && <DataGrid
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
            />
            }
        </>

    );
};

export default MainGroupTable;