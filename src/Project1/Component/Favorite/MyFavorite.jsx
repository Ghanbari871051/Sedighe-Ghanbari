import React, { useEffect, useState } from 'react';
import './FavoriteStyle.scss'
import { useNavigate } from 'react-router-dom';
import { useGlobalVariableContext } from '../../Context/GlobalVariableContext'
import CRUD from '../../Services/CRUD'
import queryString from 'query-string'; // Install the 'query-string' library if you haven't

const MyFavorite = () => {
    const { globalVariables, updateGlobalVariables } = useGlobalVariableContext();
    const navigate = useNavigate();
    const [favorite, setFavorite] = useState()

    useEffect(() => {
    }, [globalVariables])

    const fetchDataJson = async (API_Address) => {
        return await CRUD.GetData(API_Address)
    }

    const fetchFavoriteData = async () => {
        if (globalVariables.GetData_Mode === 'sql') {
            return CRUD.SQL_ExecuteQuery(`select * from Favorite where userID=${globalVariables.userInfo.user.id}`, globalVariables.urlBase_Server, false);
        } else {
            return CRUD.GetData(`${globalVariables.urlBase_DataBase}/Favorite?userID=${globalVariables.userInfo.user.id}`);
        }
    };

    const fetchProductData = async () => {
        if (globalVariables.GetData_Mode === 'sql') {
            return CRUD.SQL_ExecuteQuery(`select * from product`, globalVariables.urlBase_Server, false);
        } else {
            return CRUD.GetData(`${globalVariables.urlBase_DataBase}/product`);
        }
    };
    useEffect(() => {
       

        Promise.all([
            fetchFavoriteData(),
            fetchProductData()
        ]).then(([favoriteData, productData]) => {
            //console.log(3, favoriteData, productData);
            if (favoriteData, productData) {
                const newFavorite = favoriteData?.map(favorite => {
                    const product = productData.find(ite => ite.id === favorite.productID);
                    if (product) {
                        favorite.productName = product.title;
                        // comment.avatar = user.avatar;
                    }

                    // if (responseData) {
                    //     const responses = responseData.filter(res => res.ticketID === ticket.id);
                    //     if (responses.length > 0) {
                    //         ticket.responses = responses;
                    //     }
                    // }

                    return favorite;
                });
                setFavorite(newFavorite);
            }
        })

        //  }
        if (globalVariables.GetData_Mode === 'sql') {
        }

    }, [])


    const handleViewFavorite = (pID) => {
        const params = {
            productID: pID,
            //  productFilters: JSON.stringify(convertedArrayproductFilters),
        }

        const newTabUrl = `/appProject1/ProductCardDetails?${queryString.stringify(params)}`;
        // Open the link in a new tab using the anchor element and triggering a click
        const anchor = document.createElement('a');
        anchor.href = newTabUrl;
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';  // Recommended for security
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
    }

    const favoriteShow = favorite && favorite?.map((item, index) => {
        return <li key={index} onClick={() => handleViewFavorite(item.productID)} className="ticket-item">
            <div className="row">
                <div className="ticket-user col-md-2 col-sm-12">
                    <span className='ticketid'>{item.productID}</span>
                </div>
                <div className="ticket-user col-md-2 col-sm-12">
                    <span className="user-name">{item.productName}</span>
                </div>
                <div className="ticket-user col-md-2 col-sm-12">
                    <span className="user-name">View <i className='fa fa-eye'></i></span>
                </div>
            </div>
        </li>
    })

    return (
        <div className="MyComments-component">
            <div className="widget-box">
                <div className="widget-header bordered-bottom bordered-themesecondary">
                    <i className="widget-icon fa fa-tags themesecondary"></i>
                    <h5 className="widget-caption themesecondary">Favorite List</h5>
                </div>
                {/* <!--Widget Header--> */}
                <div className="widget-body">
                    <div className="widget-main no-padding">
                        <div className="tickets-container">
                            {/* <i onClick={() => handleNewTicket()} className='fa fa-plus btn  ticketPlus'></i> */}
                            <ul className="tickets-list">
                                {favoriteShow}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyFavorite;
