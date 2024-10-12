import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import { useGlobalVariableContext } from '../../Context/GlobalVariableContext';
import CRUD from '../../Services/CRUD';
import './NotificationStyle.scss'

const NotificationIcon = ({ className }) => {

    const { globalVariables, updateGlobalVariables } = useGlobalVariableContext();
    const [showNotification, setShowNotification] = useState(false)
    const [notifications, setNotifications] = useState([])
    const [count, setCount] = useState(0)
    const [refresh, setRefresh] = useState(false)


    const fetchData = async () => {
        // console.log(40, globalVariables.userInfo.user.id);
        Promise.all([
            globalVariables.GetData_Mode === 'sql' ?
                await CRUD.SQL_ExecuteQuery('select * from notification', globalVariables.urlBase_Server, false)
                : await CRUD.GetData(`${globalVariables.urlBase_DataBase}/notification`),

            globalVariables.GetData_Mode === 'sql' ?
                await CRUD.SQL_ExecuteQuery(`select * from notificationUsers where userID=${globalVariables.userInfo.user.id ? globalVariables.userInfo.user.id : -1}`, globalVariables.urlBase_Server, false)
                : CRUD.GetData(`${globalVariables.urlBase_DataBase}/notificationUsers?userID=${globalVariables.userInfo.user.id}`),
        ]).then(([notificationData, notificationUsersData]) => {
            if (notificationUsersData?.length > 0 && notificationData?.length > 0) {
                const newItem = notificationUsersData?.map(item => {
                    if (item.IsView === false) {
                        const k = notificationData?.filter(i => i.id === item.notificationID)
                        //  console.log(300, k);
                        if (k.length>0) {
                            item.title = k[0].title
                            item.msg = k[0].msg
                            item.url = k[0].url
                        }
                        return item
                    }
                }).filter(item => item !== undefined)
                setNotifications(newItem)
                setCount(newItem.length)
            }
        })
    }

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        if (globalVariables.env_mode !== "view") {
            fetchData()
        }
    }, [globalVariables.renderNotification, globalVariables.userInfo, refresh])

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        //   console.log(800, notifications);
    }, [count, notifications])

    const handleShowNotification = () => {
        setShowNotification(true)
    }

    const handleHideNotification = () => {
        setShowNotification(false)
    }

    const handleClose = async (item) => {
        await changeView(item)
        setRefresh(!refresh)
    }

    const handleViewBtn = async (item) => {
        await changeView(item)
        setRefresh(!refresh)
    }

    const changeView = async (item) => {
        console.log(4,item);
        let newitem = { ...item, IsView: true }
        delete newitem.title
        delete newitem.msg
        delete newitem.url
        // console.log(ne);
        if (globalVariables.env_mode === "view") {
            // const updatedItems = notifications?.map(item => {
            //     if (item.id === item.id) {
            //         // Update the price field of the item
            //         return { ...item, IsView: true };
            //     }
            //     return item;
            // });

            const updatedItems = notifications.filter(ite=> ite.id !== item.id);

            // Set the state with the updated array
            setNotifications(updatedItems);
            setCount(updatedItems.length)
        }
        else {
            const k = globalVariables.GetData_Mode === 'sql' ?
                await CRUD.SQl_Update(item.id, 'notificationUsers', globalVariables.urlBase_Server, newitem)
                : await CRUD.AddEditData(item.id, 'notificationUsers', globalVariables.urlBase_DataBase, 'edit', newitem)
        }
    }

    const notificationsItems = notifications && notifications?.map((item, index) => {
        return <div key={index} className="alert alert-info">
            <i className='fa fa-remove' onClick={() => handleClose(item)}></i>
            <br />
            <strong>{item.title}</strong>
            <p> {item.msg}</p>
            <a href={item.url} target='_blank' onClick={() => handleViewBtn(item)} type="button">View</a>
        </div>
    })

    return (
        <i className={`fa fa-bell NotificationIcon-component ${className}`}
            onMouseMove={() => handleShowNotification()}
            onMouseLeave={() => handleHideNotification()}
        >
            {count > 0 && <p className='count'> {count}</p>}
            {showNotification === true && <div className='showNotification'>
                {notificationsItems}
            </div>}
        </i>
    );
};

export default NotificationIcon;