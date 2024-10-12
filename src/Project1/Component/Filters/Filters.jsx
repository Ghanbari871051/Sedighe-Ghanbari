import React, { useEffect, useState } from 'react';
import './FiltersStyle.scss'
import RangeFilter from './RangeFilter';
import { useGlobalVariableContext } from '../../Context/GlobalVariableContext';
import GeneralFilters from './GeneralFilters';




function Filters({ ShowForPortfolio,margin, SQl_Filter_Value, SQl_Filter_List, SQl_Filter_AssignToGroupAndSubGroup, FilterType,
    filter_Price, filter_Date
}) {

    const { globalVariables, updateGlobalVariables } = useGlobalVariableContext()
    const mainGroupIDs = globalVariables.mainGroup
    const sidebarIDs = globalVariables.sidebar

    //priceSection
    filter_Price = filter_Price !== undefined ? filter_Price : [{
        min: 100,
        max: 600,
        current_min: 100,
        current_max: 600,
        step: 4,
        maxDifference: 50,
        filterNameShow: 'Price',
        FilterType: 'Range'

    }]

    const [priceRange, setPriceRange] = useState(filter_Price)
    const [priceRender, setPriceRender] = useState(false)
    const handlePrice = (current_min, current_max) => {
        setPriceRange(prevFilterPrice => {
            // Assuming you want to change the minPrice in the first item of the array
            if (prevFilterPrice.length > 0) {
                const updatedFilter = {
                    ...prevFilterPrice[0],
                    current_min: current_min,
                    current_max: current_max
                };
                // Create a new array with the updated filter at the first position and the rest unchanged
                return [updatedFilter, ...prevFilterPrice.slice(1)];
            }
            // If the array is empty, return the unchanged array
            return prevFilterPrice;
        });
        setPriceRender(!priceRender)
    }

    const PriceFilter = () => {
        return priceRange && priceRange?.map((item, index) => {
            return <RangeFilter key={index} item={item} handleItem={handlePrice} title={item.filterNameShow} step={item.step} maxDifference={item.maxDifference} min={item.min} max={item.max} />
        })
    }

    useEffect(() => {
        updateGlobalVariables({ price: priceRange });
    }, [priceRender])
    //////////////// End Price Section


    const mainGroupID_show = globalVariables.mainGroup && globalVariables.mainGroup?.map(item => {
        return <i> {item.mainGroupID} ,</i>
    })

    const sidebarID_show = globalVariables.sidebar && globalVariables.sidebar?.map(item => {
        return <i> {item.sidebarID} ,</i>
    })

    const output_show = globalVariables.Filters?.map(item => {
        return <> <i key={item.id}> {item.id} ,{item.value}</i> <br /></>
    })

    return (
        <>
            <div className="filter-component">
                <div className="FilterSide" style={{right:`${margin?'auto':'5px'}`,left:`${margin?margin:'auto'}`,top:`${margin}`} }>
                    <div className='filters'>
                        {/* <p className='showFilters'>

                    <br />
                    INPUT DATA <br />
                    <br />
                    JSON File that is have
                    1- filter Value 
                    2- Filter Name
                    3- list Group and SubGroups that you want   <br />
                    to filters show it for it or null value  <br />
                     if you want show filter for all  <br />
                    4- filter type that you want for example checkBox or Radio or etc...  <br />
                    <br />
                 
                    props:<br />
                    SQl_Filter_Value, <br />
                    SQl_Filter_List, <br />
                    SQl_Filter_AssignToGroupAndSubGroup, <br />
                    FilterType <br />
                    <br />

                    Global:<br />
                    mainGroup that show this filters is: {mainGroupID_show}<br />
                    Sidebar that show this filters is: {sidebarID_show}<br />

                    <br />
                    OUTPUT DATA:<br />{output_show}
                    {console.log('output', globalVariables.Filters)}
                </p> */}

                        <GeneralFilters
                            ShowForPortfolio={ShowForPortfolio}
                            SQl_Filter_Value={SQl_Filter_Value}
                            SQl_Filter_List={SQl_Filter_List}
                            SQl_Filter_AssignToGroupAndSubGroup={SQl_Filter_AssignToGroupAndSubGroup}
                            FilterType={FilterType}
                        />

                        {PriceFilter()}

                    </div>
                </div>
            </div>
        </>

    );
}

export default Filters;