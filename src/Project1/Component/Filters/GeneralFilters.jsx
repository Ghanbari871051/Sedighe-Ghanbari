import React, { useEffect, useState, useContext } from 'react';
import './FiltersStyle.scss'
import CRUD from '../../Services/CRUD'
import CheckBoxFilter from './CheckBoxFilter';
import RadioListFilter from './RadioListFilter';
import { useGlobalVariableContext } from '../../Context/GlobalVariableContext';
import { tr } from '@faker-js/faker';




function GeneralFilters({ ShowForPortfolio, SQl_Filter_Value, SQl_Filter_List, SQl_Filter_AssignToGroupAndSubGroup, FilterType
}) {

   // console.log(666, ShowForPortfolio);
    const { globalVariables, updateGlobalVariables } = useGlobalVariableContext();
    const [mainGroupIDs, setMainGroupIDs] = useState(globalVariables.mainGroup);
    const [sidebarIDs, setSidebarIDs] = useState(globalVariables.sidebar);
    const [render, setRender] = useState(false);
    const [FilterList, setFilterList] = useState([]);

    useEffect(() => {
        //   console.log(500, globalVariables);
        setMainGroupIDs(globalVariables.mainGroup);
        setSidebarIDs(globalVariables.sidebar);
        setFilterList([])
    }, [globalVariables.mainGroup, globalVariables.sidebar]); // Rerender when globalVariables change

    useEffect(() => {
        Fetch()
    }, [mainGroupIDs, sidebarIDs])

    useEffect(() => {
        Fetch()
    }, [])
    // RadioList,CheckBox


    // SQl_Filter_Value !== undefined ? SQl_Filter_Value : ''
    SQl_Filter_Value = SQl_Filter_Value !== undefined ? SQl_Filter_Value : `select id,filter_id,value from Filter_Value `
    // SQl_Filter_List !== undefined ? SQl_Filter_List : ''
    SQl_Filter_List = SQl_Filter_List !== undefined ? SQl_Filter_List : `select filter_id,filter_name from Filter_List`
    ShowForPortfolio === true ? SQl_Filter_AssignToGroupAndSubGroup = 'All' :
        SQl_Filter_AssignToGroupAndSubGroup = SQl_Filter_AssignToGroupAndSubGroup !== undefined ? SQl_Filter_AssignToGroupAndSubGroup :
            `SELECT DISTINCT a.filter_id
     ,              (
                        SELECT
                            s.mainGroupID AS mainGroupID
                         
                             FROM Filter_MainGroup s
                             where s.mainGroupID is not null
                             and s.filter_id=a.filter_id
                           FOR JSON PATH
                    ) AS mainGroup_ids
                    ,              (
                        SELECT
                            s.sidebarID AS sidebarID
                         
                             FROM Filter_sidebar s
                             where s.sidebarID is not null
                             and s.filter_id=a.filter_id
                           FOR JSON PATH
                    ) AS sidebar_ids
     from Filter_List a
	 where a.filter_id in(select DISTINCT filter_id from Filter_MainGroup )
	 or a.filter_id in (select DISTINCT filter_id from Filter_sidebar )
      FOR JSON PATH`

    FilterType = FilterType !== undefined ? FilterType : [
        {
            filterName: 'gender',
            FilterType: 'RadioList'
        }
    ]
    // https://roocket.ir/discuss/%D8%AA%D8%AD%D9%84%DB%8C%D9%84-%D8%AF%DB%8C%D8%AA%D8%A7%D8%A8%DB%8C%D8%B3-%DB%8C%DA%A9-%D9%81%D8%B1%D9%88%D8%B4%DA%AF%D8%A7%D9%87-%D8%A7%DB%8C%D9%86%D8%AA%D8%B1%D9%86%D8%AA%DB%8C-%D9%85%D8%AB%D9%84-%D8%AF%DB%8C%D8%AC%DB%8C%DA%A9%D8%A7%D9%84%D8%A7

    const handleChangeFilter = (id, title) => {
        const filter_type = FilterType.find(i => i.filterName === title) !== undefined ? FilterType.find(i => i.filterName === title).FilterType : 'CheckBox'

        const updateFilterList = FilterList?.map(filter => {
            if (Object.keys(filter)[0] === title) {
                const itemWeWantToUpdate = filter[title]?.map(item => {
                    if (item.id === id) {
                        switch (filter_type) {
                            case 'RadioList':
                                return { ...item, checked: true }
                            default:
                                return { ...item, checked: !item.checked }
                        }
                    }
                    switch (filter_type) {
                        case 'RadioList':
                            return { ...item, checked: false }
                        default:
                            return item
                    }
                })
                return { [title]: itemWeWantToUpdate }
            }
            return filter
        })
        setFilterList(updateFilterList);
        setRender(!render)
    }


    const GenerateDataFilter_AssignToGroupAndSubGroup = async () => {

        // const Filter_List = await CRUD.GetData(`${globalVariables.urlBase_DataBase}/Filter_List`)
        const Filter_mainGroup = await CRUD.GetData(`${globalVariables.urlBase_DataBase}/Filter_MainGroup`)
        const Filter_sidebar = await CRUD.GetData(`${globalVariables.urlBase_DataBase}/Filter_sidebar`)

        // Extract filter_ids from both arrays
        const filterIds = [
            ...Filter_mainGroup?.map(item => item.filter_id),
            ...Filter_sidebar?.map(item => item.filter_id)
        ];


        // Use Set to get unique filter_ids
        const distinctFilterIds = [...new Set(filterIds)];
        //   console.log(550, distinctFilterIds);

        const Filter_AssignToGroupAndSubGroup = []

        distinctFilterIds?.map(itemID => {
            let newItem = {}
            // console.log(100, itemID);
            newItem.filter_id = itemID

            let mainGroup_ids = []
            Filter_mainGroup?.map(item => {
                if (item.filter_id === itemID) {
                    mainGroup_ids.push({
                        "mainGroupID": item.mainGroupID
                    })
                }
            })
            newItem.mainGroup_ids = mainGroup_ids

            let sidebar_ids = []
            Filter_sidebar?.map(item => {
                if (item.filter_id === itemID) {
                    sidebar_ids.push({
                        "sidebarID": item.sidebarID
                    })
                }
            })
            newItem.sidebar_ids = sidebar_ids
            Filter_AssignToGroupAndSubGroup.push(newItem)
        })

        return Filter_AssignToGroupAndSubGroup
    }

    let Fetch = async () => {

        //   console.log(600, mainGroupIDs, sidebarIDs);
        let filtersListResult = globalVariables.GetData_Mode === 'sql' ?
            await CRUD.SQL_ExecuteQuery(SQl_Filter_List, globalVariables.urlBase_Server, false)
            : await CRUD.GetData(`${globalVariables.urlBase_DataBase}/Filter_List`)

        const filtersName = filtersListResult
        const result = [];

        if (SQl_Filter_AssignToGroupAndSubGroup !== 'All') {
            let data = globalVariables.GetData_Mode === 'sql' ?
                await CRUD.SQL_ExecuteQuery(SQl_Filter_AssignToGroupAndSubGroup, globalVariables.urlBase_Server, true)
                : await GenerateDataFilter_AssignToGroupAndSubGroup()

            //  console.log(800, data);
            mainGroupIDs && data && data.forEach(item => {
                const p = item.mainGroup_ids.forEach(Fid => {
                    const pp = mainGroupIDs.forEach(GID => {
                        if (Fid.mainGroupID === GID.mainGroupID) {
                            //prevent to push data if exist before
                            const isPresent = result.some(existingFid => existingFid === item.filter_id);
                            if (!isPresent) {
                                result.push(item.filter_id);
                            }
                        }
                    })
                })
            })

            sidebarIDs && data && data.forEach(item => {
                const p = item.sidebar_ids.forEach(Fid => {
                    const pp = sidebarIDs.forEach(GID => {
                        if (Fid.sidebarID === GID.sidebarID) {
                            //prevent to push data if exist before
                            const isPresent = result.some(existingFid => existingFid === item.filter_id);
                            if (!isPresent) {
                                result.push(item.filter_id);
                            }
                        }
                    })
                })
            })
        }//if(!==All)
        else {
            filtersListResult && filtersListResult.forEach(item => {
                result.push(item.filter_id);
            })
            //    console.log(888,filtersListResult,result);
        }


        let filtersValueResult = globalVariables.GetData_Mode === 'sql' ?
            await CRUD.SQL_ExecuteQuery(SQl_Filter_Value, globalVariables.urlBase_Server, false)
            : await CRUD.GetData(`${globalVariables.urlBase_DataBase}/Filter_Value`)

        const filtersValue = filtersValueResult

        // console.log(555, filtersName);
        //2- get filters
        // const filterDataPromises = result?.map(filtersId => CRUD.SQL_ExecuteQuery(SQl_Filter_Value, API_BaseURL));
        //  const filterDataResults = await Promise.all(filterDataPromises);

        // Process filter data results
        //  console.log(700, result, filtersValue, filtersName);
        result && result.forEach(filtersId => {
            const data = filtersValue && filtersValue.filter(i => i.filter_id === filtersId)
            if (data && data.length > 0) {
                // Add a new field to each object in the data
                const modifiedData = data?.map(item => ({
                    ...item,
                    checked: false, // Add your new field and its value here
                }));
                const filter_name = filtersName.find(i => i.filter_id === filtersId)
                setFilterList(prevFilterList => {
                    const updatedList = prevFilterList?.map(filter => {
                        if (Object.keys(filter)[0] === filter_name.filter_name) {
                            // Replace the existing entry with the new one
                            return { [filter_name.filter_name]: modifiedData };
                        }
                        return filter;
                    });

                    // If the entry doesn't exist, add a new one
                    if (!updatedList.some(filter => Object.keys(filter)[0] === filter_name.filter_name)) {
                        updatedList.push({ [filter_name.filter_name]: modifiedData });
                    }
                    return updatedList;
                });
            }
        })

    }

    useEffect(() => {
        const resultFilters = []
        const k = FilterList?.map(filter => {
            const k1 = filter[Object.keys(filter)[0]]?.map(item => {
                if (item.checked === true) {

                    resultFilters.push(item)
                }
            })
        })
        updateGlobalVariables({ Filters: resultFilters });
    }, [render])



    const showFilters = () => {
        return FilterList?.map((filter, index) => {
            const title = Object.keys(filter)[0]
            const ItemList = filter[Object.keys(filter)[0]]
            const filter_type = FilterType.find(i => i.filterName === title) !== undefined ? FilterType.find(i => i.filterName === title).FilterType : 'CheckBox'
            switch (filter_type) {
                case 'RadioList':
                    return <RadioListFilter key={index} ItemList={ItemList} handleItem={handleChangeFilter} title={title} />
                default:
                    return <CheckBoxFilter key={index} ItemList={ItemList} handleItem={handleChangeFilter} title={title} />
            }
        })
    }

    return (
        <>
            {showFilters()}
        </>

    );
}



// [
//     {
//       "filter_id": 1,
//       "mainGroup_ids": [
//         {
//           "mainGroupID": 1
//         },
//         {
//           "mainGroupID": 2
//         },
//         {
//           "mainGroupID": 3
//         }
//       ],
//       "sidebar_ids": [
//         {
//           "sidebarID": 2
//         },
//         {
//           "sidebarID": 3
//         }
//       ]
//     },
//     {
//       "filter_id": 2,
//       "mainGroup_ids": [
//         {
//           "mainGroupID": 1
//         },
//         {
//           "mainGroupID": 2
//         },
//         {
//           "mainGroupID": 3
//         }
//       ],
//       "sidebar_ids": [
//         {
//           "sidebarID": 2
//         },
//         {
//           "sidebarID": 3
//         }
//       ]
//     },
//     {
//       "filter_id": 3,
//       "mainGroup_ids": [
//         {
//           "mainGroupID": 1
//         },
//         {
//           "mainGroupID": 2
//         },
//         {
//           "mainGroupID": 3
//         }
//       ],
//       "sidebar_ids": [
//         {
//           "sidebarID": 2
//         },
//         {
//           "sidebarID": 3
//         }
//       ]
//     }
//   ]

export default GeneralFilters;
