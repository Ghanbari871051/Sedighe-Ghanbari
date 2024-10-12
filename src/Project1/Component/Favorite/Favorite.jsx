import React, { useEffect, useState } from 'react';
import './FavoriteStyle.scss'
import CRUD from '../../Services/CRUD'
import { useGlobalVariableContext } from '../../Context/GlobalVariableContext'

const Favorite = ({ productID, className }) => {

    const { globalVariables, updateGlobalVariables } = useGlobalVariableContext();

    const [Favorite, setFavorite] = useState()
    const [FavoriteID, setFavoriteID] = useState(-1)


    const checkIsFavorite = async () => {
        Promise.all([
            globalVariables.GetData_Mode === 'sql' ?
                await CRUD.SQL_ExecuteQuery(`select * from Favorite where productID=${productID ? productID : -1} and userID=${globalVariables.userInfo.user.id ? globalVariables.userInfo.user.id : -1}`, globalVariables.urlBase_Server, false)
                : await CRUD.GetData(`${globalVariables.urlBase_DataBase}/Favorite?productID=${productID ? productID : -1}&&userID=${globalVariables.userInfo.user.id ? globalVariables.userInfo.user.id : -1}`),
        ]).then(([FavoriteData]) => {

            if (FavoriteData.length > 0) {
                //  console.log(200, FavoriteData);
                setFavoriteID(FavoriteData[0].id)
                setFavorite(true)
            }
            else {
                //   console.log(201, FavoriteData);
                setFavoriteID(-1)
                setFavorite(false)
            }
        })
    }
    const handleFavorite = async () => {
        // console.log(202);
        if (Favorite === true) {
            // console.log(300, FavoriteID);
            Promise.all([
                globalVariables.GetData_Mode === 'sql' ?
                    await CRUD.SQL_ExecuteQuery(`DELETE FROM Favorite WHERE id=${FavoriteID}`, globalVariables.urlBase_Server, false)
                    : await CRUD.DeleteData(FavoriteID, 'Favorite', `${globalVariables.urlBase_DataBase}`)
            ]).then(() => {
                checkIsFavorite()
            })
        }
        else {
            let item = {
                id: Math.floor(10000 + Math.random() * 90000),
                productID: productID,
                userID: globalVariables.userInfo.user.id
            }
            if (globalVariables.GetData_Mode === 'sql') {
                delete item.id
            }
            Promise.all([
                globalVariables.GetData_Mode === 'sql' ?
                    await CRUD.SQl_Insert('Favorite', globalVariables.urlBase_Server, item)
                    : await CRUD.AddEditData(null, 'Favorite', `${globalVariables.urlBase_DataBase}`, 'insert', item),
                // fetchDataJson(`${globalVariables.urlBase_DataBase}/Users`),
                // fetchDataJson(`${globalVariables.urlBase_DataBase}/ticketResponses`)
            ]).then(() => {
                checkIsFavorite()
            })
        }
    }

    useEffect(() => {
        checkIsFavorite()
    }, [globalVariables.userInfo, productID])

    useEffect(() => {
        checkIsFavorite()
    }, [Favorite, FavoriteID])

    return (
        <div className='Favorite-component'>
            <i
                onClick={() => handleFavorite()}
                style={Favorite === true ? { color: "red" } : { color: "gray" }}
                className={`fa fa-heart  ${className}`}>

            </i>
        </div>
    );
};

export default Favorite;