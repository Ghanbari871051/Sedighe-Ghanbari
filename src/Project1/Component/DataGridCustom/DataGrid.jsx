import React, { useEffect, useState } from 'react';
import './DataGridStyle.scss';
import Pagination from '../Pagination/Pagination';
import Search from '../Search/Search';
import Select from '../Select/Select';
import DataGridTable from './DataGridTable';
import CRUDModal from './CRUDModal/CRUDModal';
import { useGlobalVariableContext } from '../../Context/GlobalVariableContext';
import Print from '../Print/Print';

function DataGrid({ Type, tableName, sqlCommand_tableData, sqlCommand_tableSchema
    , sqlCommand_tableRelation, headerFields_Name, headerFields_NoVisible, headerFields_NoEnable,
    manageFields, selectOptions_Pagesize, handleRefreshParent, FlagRefreshParent,
    pagesizeParent, currentPageParent ,handleInsert }) {

    const { globalVariables, updateGlobalVariables } = useGlobalVariableContext();
    const EndPointAPI = globalVariables.EndPointAPI
    const API_BaseURL = Type === 'sql' ? globalVariables.urlBase_Server : globalVariables.urlBase_DataBase
    const [noData, setNoData] = useState(false)
    const [mainData, setmainData] = useState([])
    const [bodyFields, setbodyFields] = useState([])
    const [headerFields, setheaderFields] = useState([])
    const [Tb_schema, setTb_Schema] = useState(null)
    const [Tb_Relation, setTb_Relation] = useState([])
    //const [changeFlag, setChangeFlag] = useState(false)
    const [pagesize, setpagesize] = useState(pagesizeParent)
    const [searchGrid, setSearchGrid] = useState('')
    const [currentPage, setcurrentPage] = useState(currentPageParent)
    const [showModal, setshowModal] = useState(false)
    const [modalItem, setModalItem] = useState({})
    const [refresh_UseState, setRefresh_UseState] = useState(false)
    const [FlagRefresh, setFlagRefresh] = useState(false)

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setpagesize(pagesizeParent)
    }, [pagesizeParent])

    useEffect(() => {
        setcurrentPage(currentPageParent)
    }, [currentPageParent])

    useEffect(() => {
        fetchDataAll()
    }, [sqlCommand_tableData, FlagRefreshParent])

    const createdefault_columnNames = () => {
        const default_columnNames = []
        Tb_schema && Tb_schema?.map(item => {
            default_columnNames.push(item.COLUMN_NAME)
        })

        sqlCommand_tableRelation && sqlCommand_tableRelation?.map(item => {
            default_columnNames.push(item.FK_Field)
        })
        return default_columnNames
    }



    const handleRefresh = () => {
        handleRefreshParent(pagesize, currentPage)
        setFlagRefresh(!FlagRefresh)
    }

    //headerFields
    const setHeader = (columnNames) => {
        const element = []
        const header = { key: 'no', name: null, access: true, visible: true }
        element.push(header);

        for (let index = 0; index < columnNames.length; index++) {
            const key = columnNames[index]
            const name = headerFields_Name.find(item => item.name === key)
            const access = headerFields_NoEnable.find(item => item.name === key)
            const visible = headerFields_NoVisible.find(item => item.name === key)

            // const header = {
            //     key: key,
            //     name: name ? name.headerNameShow : columnNames[index],
            //     access: access ? false : true,
            //     visible: visible ? false : true
            // }
            // element.push(header);

            if (columnNames[index] === 'subGroup') {
                // const header = {
                //     key: key,
                //     name: name ? name.headerNameShow : columnNames[index],
                //     access: false,
                //     visible: false
                // }
                // element.push(header);
            }
            else {
                const header = {
                    key: key,
                    name: name ? name.headerNameShow : columnNames[index],
                    access: access ? false : true,
                    visible: visible ? false : true
                }
                element.push(header);
            }
        }
        return element
    }







    // const createRelatinTB = async () => {
    //     const tb_r = []
    //     sqlCommand_tableRelation && sqlCommand_tableRelation?.map(async (item) => {
    //         const relationData = await CRUD.SQL_ExecuteQuery(item.sqlcommand, API_BaseURL,false,444)
    //         if (relationData && relationData.data.length > 0) {
    //             tb_r.push(...Tb_Relation,
    //                 {
    //                     FK_Field: item.FK_Field,
    //                     PK_table: item.PK_table,
    //                     Pk_field_show: item.Pk_field_show,
    //                     data: relationData.data
    //                 })
    //         }
    //         else {
    //         }
    //     })

    //     return tb_r
    // }

    const fetchDataAll = async () => {

        let tableData = []
        let data = []
        setbodyFields([])

        // if (Type === 'sql') {
        //     data =sqlCommand_tableData
        //    // Schema
        //     const schemaData = await CRUD.SQL_ExecuteQuery(sqlCommand_tableSchema, API_BaseURL,false,666);
        //     if (schemaData && schemaData.data.length > 0) {
        //         setTb_Schema(schemaData.data);
        //     }

        //     // Relation
        //     if (Tb_Relation.length === 0) {
        //         const t = await createRelatinTB()
        //         setTb_Relation(t)
        //     }
        // }
        //if (Type === 'json') {
        data = sqlCommand_tableData
        setTb_Schema(sqlCommand_tableSchema);
        setTb_Relation(sqlCommand_tableRelation)
        // }

        if (tableData && data.length > 0) {
            setmainData(data)
            setbodyFields(data)
            setNoData(false);
        } else {
            setmainData([]);
            setbodyFields([]);
            setNoData(true);
        }

        if (refresh_UseState === true) {
            setRefresh_UseState(false)
            setFlagRefresh(!FlagRefresh)
        }
    }

    useEffect(() => {
        if (loading === false && pagesize && mainData.length > 0) {
            setLoading(true)
        }
    }, [mainData, pagesize])

    useEffect(() => {
        fetchDataAll().then(() => {
            if (bodyFields && bodyFields.length > 0) {
                const columnNames = Object.keys(bodyFields[0]);
                setheaderFields(setHeader(columnNames))
            }
            else {
                const columnNames = createdefault_columnNames();
                setheaderFields(setHeader(columnNames))
            }
        })

    }, [FlagRefresh, refresh_UseState, loading, pagesize])

    const handlePrint = () => {
        Print.PrintDataGrid('tableGrid')
    }

    const changeSizaPage = (e) => {
        let k = selectOptions_Pagesize.find(ite => ite.id === parseInt(e.target.value))
        setpagesize(k)
        setcurrentPage(1)
        // setChangeFlag(!changeFlag)
    }

    const handleGridShowItems = (pageNumber) => {
        setcurrentPage(pageNumber)
        //  setChangeFlag(!changeFlag)
    }

  

    const handleSearchGrid = (e) => {
        setSearchGrid(e.target.value)
    }

    return (
        <>
            {loading === false && <p>Loading ...</p>}
            {loading === true && <div className="datagrid-component">
                <br />
                <br />
                <div className="container">
                    <div className="row">
                        <div className="col-10">
                            <div className="datagrid">
                                 {showModal === false && bodyFields.length <= 0 && noData === false && <p>loadind...</p>}
                                {showModal === false && bodyFields.length <= 0 && noData === true &&
                                    <>
                                        <div>
                                            {/* <button className="btn btn-success" onClick={() => FakeDataGenerator.generateData(10)}>Generate Data And Save For DataGrid</button> */}
                                            {/* <pre>{JSON.stringify(generatedData, null, 2)}</pre> */}
                                            <br />
                                            <br />
                                        </div>

                                        <p>NO Data For Showing...</p>
                                        <a href='#' onClick={() => handleInsert()} > <i className='fa fa-plus plus-Grid'></i></a>
                                    </>
                                }
                                {showModal === false && bodyFields.length > 0 && headerFields.length > 0 &&
                                    <>
                                        <div>
                                            {/* <button className="btn btn-success" onClick={() => FakeDataGenerator.generateData(10)}>Generate Data And Save For DataGrid</button> */}
                                            {/* <pre>{JSON.stringify(generatedData, null, 2)}</pre> */}
                                            <br />
                                            <br />
                                        </div>

                                        <div className="row">
                                            <div className="col-4 flex-start"><div className='flex-center'><i>Show</i>
                                                <Select className={'select-pagination'} handleClick={changeSizaPage} options={selectOptions_Pagesize} selectedID={pagesize.id} optionID='id' optionValue='num' />
                                                <i>Items</i></div></div>
                                            <div className="col-8 flex-right">
                                                <a href='#' onClick={() => handleRefresh()} ><i className='fa fa-refresh plus-Grid'></i> </a>
                                                <a href='#' onClick={() => handleInsert()} > <i className='fa fa-plus plus-Grid'></i></a>
                                                {/* <a href='#' onClick={() => printDataGrid()} > <i className='fa fa-file-pdf-o plus-Grid'></i></a> */}
                                                <a href='#' onClick={handlePrint} > <i className='fa fa-print plus-Grid'></i></a>
                                                <Search handleSearchGrid={handleSearchGrid} handleRefresh={handleRefresh} />
                                            </div>
                                        </div>
                                        <br />
                                        <div className="row">
                                            <div className="col">
                                                <div className='div-table-responsive'>
                                                    <DataGridTable
                                                        Type={Type}
                                                        pagesize={parseInt(pagesize.num)}
                                                        searchGrid={searchGrid}
                                                        currentPage={currentPage}
                                                        tableID={'tableGrid'}
                                                        mainData={mainData}
                                                        bodyFields={bodyFields}
                                                        headerFields={headerFields}
                                                        manageFields={manageFields}
                                                        handleRefresh={handleRefresh}
                                                        API_BaseURL={API_BaseURL}
                                                        tableName={tableName}
                                                        EndPointAPI={EndPointAPI}
                                                        Tb_schema={Tb_schema}
                                                        Tb_Relation={Tb_Relation}
                                                        headerFields_Name={headerFields_Name}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <Pagination handleSelectPage={handleGridShowItems} pagesize={parseInt(pagesize.num)} currentPage={currentPage} totalPages={((bodyFields.length) / parseInt(pagesize.num)) > (Math.ceil((bodyFields.length) / parseInt(pagesize.num))) ? Math.ceil((bodyFields.length) / parseInt(pagesize.num)) + 1 : Math.ceil((bodyFields.length) / parseInt(pagesize.num))} numOfshow={5} />
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            }
        </>
    );
}

// const headerFields1= [
//     { key: "no", name: null, access: true, visible: true },
//     { key: "id", name: "ID", access: true, visible: true },
//     { key: "firstname", name: "First Name", access: true, visible: true },
//     { key: "lastname", name: "Last Name", access: true, visible: true },
//     { key: "age", name: "Age", access: true, visible: true },
//     { key: "tel", name: "Tel", access: true, visible: true },
//     { key: "city", name: "City", access: true, visible: true },
//     { key: "expand", name: "expand", access: true, visible: false },
// ]

// const bodyFields1 =
//     [
//         { expand: true, firstname: "sedighe", lastname: "ghanbari", age: 1, tel: '09151250498', city: 'mashhad' },
//         { expand: false, firstname: "yahya", lastname: "sabeghi", age: 2, tel: '09151250409', city: 'mashhad' },
//         { expand: true, firstname: "sorur", lastname: "sabeghi", age: 3, tel: '09151250498', city: 'mashhad' },
//         { expand: true, firstname: "sedighe", lastname: "ghanbari", age: 4, tel: '09151250498', city: 'mashhad' },
//         { expand: true, firstname: "yahya", lastname: "sabeghi", age: 5, tel: '09151250409', city: 'mashhad' },
//         { expand: true, firstname: "sorur", lastname: "sabeghi", age: 6, tel: '09151250498', city: 'mashhad' },
//         { expand: true, firstname: "sedighe", lastname: "ghanbari", age: 7, tel: '09151250498', city: 'mashhad' },
//         { expand: true, firstname: "yahya", lastname: "sabeghi", age: 8, tel: '09151250409', city: 'mashhad' },
//         { expand: true, firstname: "sorur", lastname: "sabeghi", age: 9, tel: '09151250498', city: 'mashhad' },
//     ]



// "customData": [
//     {
//         "id": "77bc9d02-1cea-4be2-a11b-72a7acf65db8",
//         "firstname": "Grace",
//         "lastname": "Nolan",
//         "age": 3,
//         "tel": "731.572.2007 x52770",
//         "city": "Brakusfort"
//     },
//     {
//         "id": "791030a3-106c-4e6f-94a4-d932a7531f83",
//         "firstname": "Thelma",
//         "lastname": "Mayer",
//         "age": 3,
//         "tel": "(784) 691-3861 x79650",
//         "city": "Fort Kelly",
//         "expand": true,
//         "subGroup": [
//             {
//                 "id": "62a9f9a0-cc25-4f97-8551-ac7ffe121975",
//                 "name1": "Ardella",
//                 "text1": "desidero constans architecto tabella tersus",
//                 "expand": true,
//                 "subGroup": [
//                     {
//                         "id": "b0c955bd-e3d2-4def-8837-eb8242dae305",
//                         "test_1": "Delaney",
//                         "test_2": "vomica voluptate civis creptio degenero",
//                         "expand": false
//                     }
//                 ]
//             },
//             {
//                 "id": "ee055afb-5bf7-4652-a40f-27a3544b433d",
//                 "name1": "Aliya",
//                 "text1": "defero sumptus apostolus claro dicta",
//                 "expand": true,
//                 "subGroup": [
//                     {
//                         "id": "cbcb3bcd-61a9-4eec-aaed-a4a1f4dcb5ef",
//                         "test_1": "Brandt",
//                         "test_2": "velum venio ullam vicinus ater",
//                         "expand": false
//                     }
//                 ]
//             }
//         ]
//     }
// ]



// const sqlCommand_tableRelation = `
//     SELECT
//       /* FK.name AS ForeignKeyName, */
//       PC.name AS FKC,
//       RC.name AS PKC,
//       TP.name AS FKT,
//       FK2.name AS PKT
//     FROM
//       sys.foreign_keys AS FK
//       INNER JOIN sys.tables AS TP ON TP.object_id = FK.parent_object_id
//       INNER JOIN sys.foreign_key_columns AS FKC ON FKC.constraint_object_id = FK.object_id
//       INNER JOIN sys.columns AS PC ON PC.object_id = TP.object_id AND PC.column_id = FKC.parent_column_id
//       INNER JOIN sys.tables AS FK2 ON FK2.object_id = FK.referenced_object_id
//       INNER JOIN sys.columns AS RC ON RC.object_id = FK2.object_id AND RC.column_id = FKC.referenced_column_id

//       where TP.name='${tableName}'
//     ORDER BY
//       FKC
//       /*, ForeignKeyName; */
//   `;






// const tableName = 'customData'//table
//  const tableName = 'city'


//const sqlCommand_tableData = `select * from city`
// const sqlCommand_tableName1 = `select customData.id,firstname,lastname,age,tell,customData.city as city,customData.color as color
// , city.name as extra_cityName , color.name as fk_color
//     from customData
//             INNER JOIN city ON customData.city=city.id
//             INNER JOIN color ON customData.color=color.id
//             FOR JSON PATH`

// const sqlCommand_tableData = `select md.id,firstname,lastname,age,tell,md.city as city,md.color as color
// , city.name as extra_cityName , color.name as fk_color
// ,
//             (
//                 SELECT
//                     id AS id,
//                     s.name AS name,

//                     (
//                         SELECT
//                             id AS id,
//                             ostan AS ostan
//                                            FROM ostan ns
//                                              WHERE ns.id = s.ostan
//                                        FOR JSON PATH
//                     ) AS subGroup
//                 FROM city s
//                 WHERE s.id = md.city
//                 FOR JSON PATH
//             ) AS subGroup
//     from customData md
//             INNER JOIN city ON md.city=city.id
//             INNER JOIN color ON md.color=color.id
//             FOR JSON PATH`

// const sqlCommand_tableSchema = `SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE 
//       FROM INFORMATION_SCHEMA.COLUMNS
//      where TABLE_NAME='${tableName}'`

// const sqlCommand_tableRelation = []
// const sqlCommand_tableRelation = [
//     {
//         FK_Field: 'extra_cityName',
//         PK_table: 'city',
//         Pk_field_show: 'name',
//         sqlcommand: 'select id,name from city'
//     },
//     {
//         FK_Field: 'fk_color',
//         PK_table: 'color',
//         Pk_field_show: 'name',
//         sqlcommand: 'select id,name from color'
//     }
// ]

// // const headerFields_Name= []
// const headerFields_Name = [
//     {
//         name: 'extra_cityName',
//         headerNameShow: 'city'
//     },
//     {
//         name: 'fk_color',
//         headerNameShow: 'color'
//     }
// ]
// // const headerFields_NoVisible = []
// const headerFields_NoVisible = [
//     {
//         name: 'city'
//     },
//     {
//         name: 'color'
//     },
//     {
//         name: 'id'
//     }
// ]

// //const headerFields_NoEnable = []
// const headerFields_NoEnable = [
//     {
//         name: 'id'
//     },

//     // {
//     //     name: 'fk_color'
//     // }
// ]

// const manageFields = [
//     { name: 'delete', icon: 'fa fa-remove', status: true },
//     { name: 'edit', icon: 'fa fa-edit', status: true },
//     { name: 'view', icon: 'fa fa-eye', status: true }
// ]
// const selectOptions_Pagesize = [
//     { id: 1, value: 5 },
//     { id: 2, value: 10 },
//     { id: 3, value: 20 },
//     { id: 4, value: 50 }
// ]


export default DataGrid;
