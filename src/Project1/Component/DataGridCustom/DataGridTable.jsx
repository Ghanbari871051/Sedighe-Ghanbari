import React, { useEffect, useState } from 'react';
import DataGridHeader from './DataGridHeader';
import DataGridBody from './DataGridBody';
import DataGridFooter from './DataGridFooter';

function DataGridTable(props) {
         
console.log(33,props.bodyFields);
    const [bodyFieldsCopy, setbodyFieldsCopy] = useState(props.bodyFields)
    const [Flag, setFlag] = useState(false)
    const [changeFlag, setChangeFlag] = useState(false)
    const [searchItems, setSearchItems] = useState()

    const handleSort = (e, headerkey, countForSort) => {
        e.preventDefault()
        e.stopPropagation()
        Object.keys(bodyFieldsCopy[0])?.map((k, index) => {
            if (k === headerkey) {
                if (countForSort % 2 === 0) {
                    setbodyFieldsCopy(bodyFieldsCopy.sort((a, b) => ((a)[Object.keys(a)[index]]) >= ((b)[Object.keys(b)[index]]) ? 1 : -1))
                }
                else {
                    setbodyFieldsCopy(bodyFieldsCopy.sort((a, b) => ((a)[Object.keys(a)[index]]) <= ((b)[Object.keys(b)[index]]) ? 1 : -1))
                }
            }
        })
        setFlag(true)
        setChangeFlag(!changeFlag)
    }


    ///////////////////  filter
    const [filterCriteria, setFilterCriteria] = useState({})

    const handleHeaderSearch = async (e, headerKey) => {
       // console.log(47, e, headerKey);
        e.preventDefault()
        e.stopPropagation()
     //   console.log(77, filterCriteria);

        setFilterCriteria({
            ...filterCriteria,
            [headerKey]: e.target.value,
        });

        // if (!value) {
        //     setbodyFieldsCopy(props.bodyFields)
        //     return null
        // }
        // const r = bodyFieldsCopy?.map((t, index) => {
        //     if (t[headerKey].toString().toLowerCase().includes(value)) {
        //         return t
        //     }
        //     bodyFieldsCopy.filter((item) => {
        //         return item.age === 30 && item.city === 'New York' && item.name === 'Alice';
        //     });
        // })
        // const filteredArray = r.filter(function (element) {
        //     return element !== undefined;
        // })
        // setbodyFieldsCopy(filteredArray)
        // console.log(value);
        // let c = value
        // setSearchItems(e.target.value)
        // setChangeFlag(!changeFlag)

        setFlag(true)
        setChangeFlag(!changeFlag)
    }

    useEffect(() => {
        // all filter
        const filterData = (item) => {
            return Object.values(item).some((value) => {
                if (props.searchGrid === '' || props.searchGrid === undefined) {
                    return true // No filter, include the item
                }
                return (value.toString() ?? '').toLowerCase().includes(props.searchGrid)
            }
            );

        }
        // Filter the data based on the search query
        const filteredDataAll = props.bodyFields && props.bodyFields.filter(filterData);

        //filter based on columns
        const filteredData = filteredDataAll && filteredDataAll.filter((item) => {
            // Check each filter field dynamically
            return Object.entries(filterCriteria).every(([key, value]) => {
                if (value === '') {
                    return true; // No filter, include the item
                }
                if (item[key] === undefined) {
                    return true; // Field doesn't exist in item, include it
                }
                if (props.searchGrid !== '' && props.searchGrid !== undefined) {
                    return item[key].toLowerCase().includes(value.toLowerCase()) && item[key].toLowerCase().includes(props.searchGrid.toLowerCase())
                }
                if (props.searchGrid === '' || props.searchGrid === undefined) {
                    return item[key].toLowerCase().includes(value.toLowerCase())
                }
            });
        });

        setbodyFieldsCopy(filteredData)

    }, [filterCriteria, props.searchGrid])


    useEffect(() => {
        if (Flag === true) {
            setFlag(false)
        }
        else { 
           
            if (props.intoGrid === true) {
                setbodyFieldsCopy(props.bodyFields)
            }
            else {
                setbodyFieldsCopy(props.bodyFields.slice(props.pagesize * (props.currentPage - 1), props.pagesize * (props.currentPage - 1) + parseInt(props.pagesize)))
            }
        }
    }, [props.pagesize, props.currentPage, changeFlag, props.bodyFields]
    )

    return (
        <>
            {bodyFieldsCopy &&
                <table className='pdf_DataGrid' id={props.tableID}>
                    <thead><DataGridHeader bodyFields={bodyFieldsCopy} handleHeaderSearch={handleHeaderSearch} handleSort={handleSort} tableID={props.tableID} headerFields={props.headerFields} /></thead>
                    <tbody><DataGridBody  currentPage={props.currentPage} pagesize={props.pagesize} Type={props.Type} Tb_Relation={props.Tb_Relation} Tb_schema={props.Tb_schema} EndPointAPI={props.EndPointAPI} API_BaseURL={props.API_BaseURL} tableName={props.tableName} handleRefresh={props.handleRefresh} mainData={props.mainData} tableID={props.tableID} bodyFields={bodyFieldsCopy} headerFields={props.headerFields} manageFields={props.manageFields} headerFields_Name={props.headerFields_Name} /></tbody>
                    <tfoot><DataGridFooter headerFields={props.headerFields} sum={12} /></tfoot>
                </table>
            }</>
    );
}

export default DataGridTable;