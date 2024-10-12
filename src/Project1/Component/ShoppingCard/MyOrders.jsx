
// Ticket.js
import React, { useEffect, useState } from 'react';
import './ShoppingCardStyle.scss'
import OrderDetails from './OrderDetails';
import { useNavigate } from 'react-router-dom';
import { useGlobalVariableContext } from '../../Context/GlobalVariableContext'
import CRUD from '../../Services/CRUD'

const MyOrders = () => {
    const { globalVariables, updateGlobalVariables } = useGlobalVariableContext();
    const navigate = useNavigate();
    const [orders, setOrders] = useState()


    const fetchDataJson = async () => {
        Promise.all([
            fetchDataJson(`${globalVariables.urlBase_DataBase}/orders`),
            fetchDataJson(`${globalVariables.urlBase_DataBase}/Users`),
            //  fetchDataJson(`${globalVariables.urlBase_DataBase}/orderDetails`)
        ]).then(([ordersData, usersData]) => {
            if (ordersData && usersData) {
                const newOrders = ordersData?.map(order => {
                    const user = usersData.find(user => user.id === order.userID);
                    if (user) {
                        order.name = user.name;
                        order.avatar = user.avatar;
                    }
                    return order;
                });
                setOrders(newOrders);
            }
        })
    }

    const fetchDataSQL = async () => {
        const sqlcommand = ` SELECT *,
         (select name from Users where id=o.userID)as name,
        (select avatar from Users where id=o.userID)as avatar
                from orders o`
        Promise.all([
            await CRUD.SQL_ExecuteQuery(sqlcommand, globalVariables.urlBase_Server, false)
        ]).then(([ordersData]) => {
            setOrders(ordersData);
        })
    }

    useEffect(() => {
    }, [orders])

    useEffect(() => {
        globalVariables.GetData_Mode === 'sql' ? fetchDataSQL() : fetchDataJson()
    }, [])


    const handleOrderDetails = (order) => {
        //   console.log(44,ticket);
        navigate('/appProject1/OrderDetails', {
            state: {
                orderID: order.id
            }
        });
    }


    const ordersShow = orders && orders?.map((item, index) => {
        let dateString = item.paymentDate;
        let dateObject = new Date(dateString);
        let timeRegist = !isNaN(dateObject.getDate()) && `${dateObject.getMonth()}-${dateObject.getDay()}-${dateObject.getFullYear()}`


        // dateString = item.lastUpdateDate;
        // dateObject = new Date(dateString);
        // let timeLastUpdate = !isNaN(dateObject.getDate()) && `${dateObject.getMonth()}-${dateObject.getDay()}-${dateObject.getFullYear()}`

        return <li key={index} onClick={() => handleOrderDetails(item)} className="ticket-item">
            <div className="row">
                <div className="ticket-user col-md-2 col-sm-12">
                    <span className='ticketid'>{item.id}</span>
                    <img src={`${globalVariables.imageBasePath}/${item.avatar}`} className="user-avatar" />
                    <span className="user-name">{item.name}</span>

                </div>
                <div className="ticket-title col-md-2 col-sm-12">
                    <span className="title">{item.paymentType}</span>
                </div>
                <div className="ticket-title col-md-2 col-sm-12">
                    <span className="title">{item.FollowPaymentID}</span>
                </div>
                <div className="ticket-title col-md-2 col-sm-12">
                    <span className="title">{item.price}</span>
                </div>
                <div className="ticket-time  col-md-2 col-sm-6 col-xs-12">
                    <div className="divider hidden-md hidden-sm hidden-xs"></div>
                    <span className="time">{timeRegist}</span>
                    {/* <span className="time-last">{timeLastUpdate}</span> */}
                </div>
                <div className="ticket-type  col-md-2 col-sm-6 col-xs-12">
                    <span className="divider hidden-xs"></span>

                    <span className="title">{item.status}</span>
                </div>
                {item.status === 'delivered' && <div className="ticket-state bg-palegreen">
                    <i className="fa fa-check"></i>
                </div>
                }
            </div>
        </li>
    })

    return (
        <div className="myOrder-component">
            <div className="widget-box">
                <div className="widget-header bordered-bottom bordered-themesecondary">
                    <i className="widget-icon fa fa-tags themesecondary"></i>
                    <h5 className="widget-caption themesecondary">My Orders</h5>
                </div>
                {/* <!--Widget Header--> */}
                <div className="widget-body">
                    <div className="widget-main no-padding">
                        <div className="tickets-container">
                            {/* <i onClick={() => handleNewTicket()} className='fa fa-plus btn  ticketPlus'></i> */}
                            <ul className="tickets-list">
                                {ordersShow}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyOrders;
