
// Ticket.js
import React, { useEffect, useState } from 'react';
import './TicketStyle.scss'
import TicketDetails from './TicketDetails';
import { useNavigate } from 'react-router-dom';
import { useGlobalVariableContext } from '../../Context/GlobalVariableContext'
import CRUD from '../../Services/CRUD'

const MyTickets = () => {
    const { globalVariables, updateGlobalVariables } = useGlobalVariableContext();
    const navigate = useNavigate();
    const [tickets, setTickets] = useState()


    const fetchDataJson = async () => {
        Promise.all([
            await CRUD.GetData(`${globalVariables.urlBase_DataBase}/tickets`),
            await CRUD.GetData(`${globalVariables.urlBase_DataBase}/Users`),
            await CRUD.GetData(`${globalVariables.urlBase_DataBase}/ticketResponses`)
        ]).then(([ticketsData, usersData, responseData]) => {
            if (ticketsData && usersData) {
                const newTickets = ticketsData?.map(ticket => {
                    const user = usersData.find(user => user.id === ticket.sender);
                    if (user) {
                        ticket.name = user.name;
                        ticket.avatar = user.avatar;
                    }

                    if (responseData) {
                        const responses = responseData.filter(res => res.ticketID === ticket.id);
                        if (responses.length > 0) {
                            ticket.responses = responses;
                        }
                    }

                    return ticket;
                });
                setTickets(newTickets);
            }
        })
    }

    const fetchDataSQL = async () => {
        const sqlcommand = `select * 
         ,(select name from Users where id=t.sender) as name,
                        (select avatar from Users where id=t.sender) as avatar
         ,(select * from ticketResponses where ticketResponses.ticketID = t.id for JSON path) as responses
         from tickets t
         for json path, INCLUDE_NULL_VALUES`
        let ticket = await CRUD.SQL_ExecuteQuery(sqlcommand, globalVariables.urlBase_Server, true)
        setTickets(ticket);
    }

    useEffect(() => {
    }, [tickets])

    useEffect(() => {
        globalVariables.GetData_Mode === 'sql' ? fetchDataSQL() : fetchDataJson()
    }, [])


    const handleTicketDetails = (ticket) => {
        //console.log(44,ticket);
        navigate('/appProject1/TicketDetails', {
            state: {
                ticketID: ticket.id
            }
        });
    }

    const handleNewTicket = () => {
        navigate('/appProject1/NewTicket', {
            state: {
            }
        });
    }

    const TicketsShow = tickets && tickets?.map((item, index) => {
        let dateString = item.createDate;
        let dateObject = new Date(dateString);
        let timeRegist = !isNaN(dateObject.getDate()) && `${dateObject.getMonth()}-${dateObject.getDay()}-${dateObject.getFullYear()}`


        dateString = item.lastUpdateDate;
        dateObject = new Date(dateString);
        let timeLastUpdate = !isNaN(dateObject.getDate()) && `${dateObject.getMonth()}-${dateObject.getDay()}-${dateObject.getFullYear()}`

        return <li key={index} onClick={() => handleTicketDetails(item)} className="ticket-item">
            <div className="row">
                <div className="ticket-user col-md-2 col-sm-12">
                    <span className='ticketid'>{item.id}</span>
                    <img src={`${globalVariables.imageBasePath}/${item.avatar}`} className="user-avatar" />
                    <span className="user-name">{item.name}</span>

                </div>
                <div className="ticket-title col-md-4 col-sm-12">
                    {item.attachFileName !== '' && <i className="fa fa-paperclip attach"></i>}
                    <span className="title">{item.title}</span>

                </div>
                <div className="ticket-time  col-md-4 col-sm-6 col-xs-12">
                    <div className="divider hidden-md hidden-sm hidden-xs"></div>
                    <span className="time">{timeRegist}</span>
                    <span className="time-last">{timeLastUpdate}</span>
                </div>
                <div className="ticket-type  col-md-2 col-sm-6 col-xs-12">
                    <span className="divider hidden-xs"></span>
                    <span className="type">{item.type}</span>
                </div>
                {item.status === 'close' && <div className="ticket-state bg-palegreen">
                    <i className="fa fa-check"></i>
                </div>
                }
            </div>
        </li>
    })

    return (
        <div className="myTicket-component">
            <div className="widget-box">
                <div className="widget-header bordered-bottom bordered-themesecondary">
                    <i className="widget-icon fa fa-tags themesecondary"></i>
                    <h5 className="widget-caption themesecondary">Ticket Board</h5>
                </div>
                {/* <!--Widget Header--> */}
                <div className="widget-body">
                    <div className="widget-main no-padding">
                        <div className="tickets-container">
                            <i onClick={() => handleNewTicket()} className='fa fa-plus ticketPlus'></i>
                            <ul className="tickets-list">
                                {TicketsShow}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyTickets;
