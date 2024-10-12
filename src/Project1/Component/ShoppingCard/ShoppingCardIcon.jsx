import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import { useGlobalVariableContext } from '../../Context/GlobalVariableContext';
import CRUD from '../../Services/CRUD';
import ShoppingCard from './ShoppingCard';

const ShoppingCardIcon = ({ className }) => {

    const { globalVariables, updateGlobalVariables } = useGlobalVariableContext();
    const [count, setCount] = useState(0)
    const [showShoppingCard, setShowShoppingCard] = useState(false)

    const fetchData = async () => {
        if (globalVariables.userInfo.user.id) {
            setCount(0)
            Promise.all([
                globalVariables.GetData_Mode === 'sql' ?
                    await CRUD.SQL_ExecuteQuery(`select * from shoppingCard where userID=${globalVariables.userInfo.user.id}`, globalVariables.urlBase_Server, false)
                    : await CRUD.GetData(`${globalVariables.urlBase_DataBase}/shoppingCard?userID=${globalVariables.userInfo.user.id}`),
            ]).then((data) => {
                if (data) {
                    if (data[0].length > 0) {
                        let calcount = 0
                        data[0]?.map(item => {
                            calcount += item.count
                        })
                        setCount(calcount)
                    }
                }
            })
        }
    }

    useEffect(() => {
        //    console.log('sgh');
        fetchData()

    }, [globalVariables.renderShoppingCard, globalVariables.userInfo])

    useEffect(() => {
    }, [count])

    const handleShowShoppingCard = () => {
        setShowShoppingCard(true)
    }

    const handleHideShoppingCard = () => {
        setShowShoppingCard(false)
    }

    return (
        // <Link to={`/${globalVariables.ProjectName}/ShoppingCard`}> </Link>
            <i alt="ShoppingCard"
                className={`fa fa-shopping-cart ShoppingCardIcon-component ${className}`}
                onMouseMove={() => handleShowShoppingCard()}
                onMouseLeave={() => handleHideShoppingCard()}
            >
                {count > 0 && <p className='count'> {count}</p>}
                {showShoppingCard === true && <div className='showShoppingCard'><ShoppingCard /></div>}
            </i>
       
    );
};

export default ShoppingCardIcon;