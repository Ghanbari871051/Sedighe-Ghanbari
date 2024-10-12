import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useGlobalVariableContext } from '../../Context/GlobalVariableContext'
import FileUpload from '../FileUpload/FileUpload';
import CRUD from '../../Services/CRUD'
import Alert from '../Alert/Alert';
import FileDeleter from '../FileUpload/FileDeleter';
import PublicFunction from '../../Services/PublicFunction'
import Modal from '../Modal/Modal';

const TicketDetails = () => {

    const { globalVariables, updateGlobalVariables } = useGlobalVariableContext();


    const location = useLocation();
    const { ticketID } = location.state;
    const [msg, setMsg] = useState('')
    const [imageFileNmae, setImageFileNmae] = useState('');
    const [imageBase64, setImageBase64] = useState('');
    const [ticket, setTicket] = useState()
    const [showAlert, setShowAlert] = useState(false)
    const [AlertType, setAlertType] = useState('')
    const [refresh, setRefresh] = useState(false)
    const [showModal, setshowModal] = useState(false);

    const fetchDataJson = async () => {
        Promise.all([
            fetchDataJson(`${globalVariables.urlBase_DataBase}/tickets?id=${ticketID}`),
            fetchDataJson(`${globalVariables.urlBase_DataBase}/Users`),
            fetchDataJson(`${globalVariables.urlBase_DataBase}/ticketResponses`)
        ]).then(([ticketData, usersData, responseData]) => {
            if (ticketData && usersData) {
                const ticket = ticketData[0]
                const newTicket = () => {
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
                }
                setTicket(newTicket);
            }
        })
    }

    const fetchDataSQL = async () => {
        const sqlcommand = `select * 
         ,(select name from Users where id=t.sender) as name,
                        (select avatar from Users where id=t.sender) as avatar
         ,(select * from ticketResponses where ticketResponses.ticketID = t.id for JSON path) as responses
         from tickets t
         where id=${ticketID}
         for json path, INCLUDE_NULL_VALUES`
        let ticket = await CRUD.SQL_ExecuteQuery(sqlcommand, globalVariables.urlBase_Server, true)
        ticket && setTicket(ticket[0]);
    }

    useEffect(() => {
        globalVariables.GetData_Mode === 'sql' ? fetchDataSQL() : fetchDataJson()
    }, [ticketID, refresh, globalVariables])

    useEffect(() => {
        // console.log(111, ticket);
    }, [ticket])

    const handleSendMsg = () => {
        if (globalVariables.env_mode !== "view") {
            let response = {}
            response.id = Math.floor(10000 + Math.random() * 90000)
            response.ticketID = ticketID
            response.parentID = null
            response.attachFileName = imageFileNmae
            response.sender = globalVariables.userInfo.user.id !== undefined ? globalVariables.userInfo.user.id : ''
            response.description = msg

            AddResponse(response).then((status) => {
                setAlertType(status === 'success' ? 'success' : 'danger')
                setShowAlert(true)
                document.getElementById('fileInput').value = '';
                setMsg('')
                setRefresh(!refresh)

            })
        }
    }


    const AddResponse = async (response) => {
        const res = CRUD.AddEditData(null, 'ticketResponses', globalVariables.urlBase_DataBase, 'insert', response)
        return res
    }
    const handleGetBase64 = (base64, fileName) => {
        deleteOldFile().then(() => {
            setImageFileNmae(fileName)
            setImageBase64(base64)
        })
    }

    const deleteOldFile = async () => {
        if (imageFileNmae !== '') {
            FileDeleter.FileDeleter(globalVariables.urlBase_Server, imageFileNmae)
        }
    }

    const handleShowAttachFile = async (fileName) => {
        setImageBase64('')
        const base64 = await PublicFunction.ImageBase64(globalVariables.UploadFileBasePath_Server, fileName)
        setImageBase64(base64)
        setshowModal(true)
    }

    const closeModal = () => {
        setshowModal(false);
    };

    const showcontent = () => {
        let dateString = ticket.createDate;
        let dateObject = new Date(dateString);
        let timeRegist = !isNaN(dateObject.getDate()) && `${dateObject.getMonth()}-${dateObject.getDay()}-${dateObject.getFullYear()}`


        dateString = ticket.lastUpdateDate;
        dateObject = new Date(dateString);
        let timeLastUpdate = !isNaN(dateObject.getDate()) && `${dateObject.getMonth()}-${dateObject.getDay()}-${dateObject.getFullYear()}`

        return <div className="ticketDetails-component">

            <Modal showModal={showModal} onClose={closeModal}>
                {showModal && imageBase64 && <img src={imageBase64} alt="Uploaded File" />}
            </Modal>

            <div className="row">
                <div className="col-12">
                    <div className="padding-top-2x mt-2 hidden-lg-up"></div>
                    <div className="table-responsive margin-bottom-2x">
                        <table className="table margin-bottom-none">
                            <thead>
                                <tr>
                                    <th>Date Submitted</th>
                                    <th>Last Updated</th>
                                    <th>Type</th>
                                    <th>Priority</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{timeRegist}</td>
                                    <td>{timeLastUpdate}</td>
                                    <td>{ticket.type}</td>
                                    <td><span className="text-warning">{ticket.priority}</span></td>
                                    <td><span className="text-primary">{ticket.status}</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    {/* <!-- Messages--> */}

                    <div className="comment">
                        <div className="comment-author-ava">
                            <img src={`${globalVariables.imageBasePath}/${ticket.avatar}`} alt="avatar" />
                        </div>
                        <p className="comment-text">{ticket.title}</p>
                        <p className="comment-text">{ticket.description}</p>
                    </div>

                    {ticket.responses && ticket.responses?.map(item => {
                        return <div className="comment">
                            <div className="comment-author-ava">
                                <img src={`${globalVariables.imageBasePath}/${ticket.avatar}`} alt="avatar" />
                            </div>
                            <div className="comment-body">
                                {item.attachFileName !== '' && <i onClick={() => handleShowAttachFile(item.attachFileName)} className="fa fa-paperclip attach"></i>}
                                <p className="comment-text">{item.description}</p>
                                <div className="comment-footer"><span className="comment-meta">{item.name}</span></div>
                            </div>
                        </div>
                    })}


                    {/* <!-- Reply Form--> */}
                    <h5 className="mb-30 padding-top-1x">Leave Message</h5>
                    <div className="form-group">
                        <textarea value={msg} onChange={(e) => setMsg(e.target.value)} className="form-control form-control-rounded" rows="8" placeholder="Write your message here..." required=""></textarea>
                    </div>
                    <div className="form-group fileInput">
                        <FileUpload id={'fileInput'} handleGetBase64={handleGetBase64} />
                    </div>

                    <div className="text-right">
                        {showAlert === true && <Alert className={AlertType}
                            msg={AlertType === 'success' ? 'your Response submitted' : 'your Response Failed!'}
                            title={`${AlertType}!`} />}
                        <button onClick={handleSendMsg} className=" btn-submit" type="submit">Submit Message</button>
                    </div>
                </div>
            </div>
        </div>
    }
    return (
        <>
            {ticket && showcontent()}
        </>
    );
};

export default TicketDetails;