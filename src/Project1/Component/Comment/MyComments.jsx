

// Ticket.js
import React, { useEffect, useState } from 'react';
import './CommentStyle.scss'
import { useNavigate } from 'react-router-dom';
import { useGlobalVariableContext } from '../../Context/GlobalVariableContext'
import CRUD from '../../Services/CRUD'

const MyComments = () => {
    const { globalVariables, updateGlobalVariables } = useGlobalVariableContext();
    const navigate = useNavigate();
    const [comments, setComments] = useState()


    const fetchDataJson = async (API_Address) => {
        return await CRUD.GetData(API_Address)
    }



    useEffect(() => {
    }, [globalVariables])


    const fetchCommentData = async () => {
        if (globalVariables.GetData_Mode === 'sql') {
            return CRUD.SQL_ExecuteQuery(`select * from Comments where senderID=${globalVariables.userInfo.user.id}`, globalVariables.urlBase_Server, false);
        } else {
            return CRUD.GetData(`${globalVariables.urlBase_DataBase}/Comments?senderID=${globalVariables.userInfo.user.id}`);
        }
    };

    const fetchUserData = async () => {
        if (globalVariables.GetData_Mode === 'sql') {
            return CRUD.SQL_ExecuteQuery(`select * from Users`, globalVariables.urlBase_Server, false);
        } else {
            return CRUD.GetData(`${globalVariables.urlBase_DataBase}/Users`);
        }
    };
    useEffect(() => {
        //if (globalVariables.GetData_Mode === 'json') {
        Promise.all([
            fetchCommentData(),
            fetchUserData()
        ]).then(([commentsData, usersData]) => {
            if (commentsData, usersData) {
                const newComments = commentsData?.map(comment => {
                    const user = usersData.find(user => user.id === comment.senderID);
                    if (user) {
                        comment.name = user.name;
                        comment.avatar = user.avatar;
                    }

                    // if (responseData) {
                    //     const responses = responseData.filter(res => res.ticketID === ticket.id);
                    //     if (responses.length > 0) {
                    //         ticket.responses = responses;
                    //     }
                    // }

                    return comment;
                });
                setComments(newComments);
            }
        })

        //  }
        if (globalVariables.GetData_Mode === 'sql') {
        }

    }, [])


    // const handleTicketDetails = (ticket) => {
    //     console.log(44,ticket);
    //     navigate('/TicketDetails', {
    //         state: {
    //             ticketID: ticket.id
    //         }
    //     });
    // }



    const commentsShow = comments && comments?.map((item, index) => {
        let dateString = item.date;
        let dateObject = new Date(dateString);
        let timeRegist = !isNaN(dateObject.getDate()) && `${dateObject.getMonth()}-${dateObject.getDay()}-${dateObject.getFullYear()}`


        // dateString = item.lastUpdateDate;
        // dateObject = new Date(dateString);
        // let timeLastUpdate = !isNaN(dateObject.getDate()) && `${dateObject.getMonth()}-${dateObject.getDay()}-${dateObject.getFullYear()}`

        return <li key={index} className="ticket-item">
            <div className="row">
                <div className="ticket-user col-md-2 col-sm-12">
                    <span className='ticketid'>{item.id}</span>
                    {/* <img src={`${globalVariables.imageBasePath}/${item.avatar}`} className="user-avatar" /> */}
                    <span className="user-name">{item.name}</span>

                </div>
                <div className="ticket-title col-md-4 col-sm-12">
                    {/* {item.attachFileName !== '' && <i className="fa fa-paperclip attach"></i>} */}
                    <span className="title">{item.comment}</span>

                </div>
                <div className="ticket-time  col-md-4 col-sm-6 col-xs-12">
                    <div className="divider hidden-md hidden-sm hidden-xs"></div>
                    <span className="time">{timeRegist}</span>
                    {/* <span className="time-last">{timeLastUpdate}</span> */}
                </div>
                {/* <div className="ticket-type  col-md-2 col-sm-6 col-xs-12">
                    <span className="divider hidden-xs"></span>
                    <span className="type">{item.type}</span>
                </div>
                {item.status === 'close' && <div className="ticket-state bg-palegreen">
                    <i className="fa fa-check"></i>
                </div>
                } */}
            </div>
        </li>
    })

    return (
        <div className="MyComments-component">
            <div className="widget-box">
                <div className="widget-header bordered-bottom bordered-themesecondary">
                    <i className="widget-icon fa fa-tags themesecondary"></i>
                    <h5 className="widget-caption themesecondary">Comments List</h5>
                </div>
                {/* <!--Widget Header--> */}
                <div className="widget-body">
                    <div className="widget-main no-padding">
                        <div className="tickets-container">
                            {/* <i onClick={() => handleNewTicket()} className='fa fa-plus btn  ticketPlus'></i> */}
                            <ul className="tickets-list">
                                {commentsShow}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyComments;
