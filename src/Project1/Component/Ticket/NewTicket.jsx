import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalVariableContext } from '../../Context/GlobalVariableContext'
import CRUD from '../../Services/CRUD'
import Alert from '../Alert/Alert';
import FileUpload from '../FileUpload/FileUpload';
import FileDeleter from '../FileUpload/FileDeleter';


const NewTicket = () => {
    const { globalVariables, updateGlobalVariables } = useGlobalVariableContext();

    const [imageFileNmae, setImageFileNmae] = useState('');
    const [imageBase64, setImageBase64] = useState('');
    //  const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const [showAlert, setShowAlert] = useState(false)
    const [AlertType, setAlertType] = useState('')

    const Types = [
        { value: 'Request' },
        { value: 'Inquiry' },
        { value: 'Issue' }
    ]

    const priority = [
        { value: 'High' },
        { value: 'Middle' },
        { value: 'Low' }
    ]

    const [ticketFields, setTichetFields] = useState({
        id: Math.floor(10000 + Math.random() * 90000),
        title: '',
        description: '',
        attachFileName: '',
        type: Types[0].value,
        priority: priority[0].value,
        status: 'open',
        sender: globalVariables.userInfo.user.id,
        createDate: new Date()
    })



    const handlechange = (e) => {
        setTichetFields(prev => ({ ...prev, [e.target.name]: e.target.value }))

    }

    const handleSendTichet = () => {
        if (globalVariables.env_mode !== "view") {
            setLoading(true)

            //Add Tichet
            AddTicket().then((status) => {
                // console.log(100, status);
                setAlertType(status === 'success' ? 'success' : 'danger')
                setShowAlert(true)
                clearItems()
                setLoading(false)
                //  console.log(77, ticketFields);
            })
        }
    }


    const AddTicket = async () => {
        //   console.log(999, ticketFields);
        if (globalVariables.GetData_Mode === 'sql') {
            delete ticketFields.id
        }
        const res = globalVariables.GetData_Mode === 'sql' ?
            await CRUD.SQl_Insert('tickets', globalVariables.urlBase_Server, ticketFields)
            : await CRUD.AddEditData(null, 'tickets', globalVariables.urlBase_DataBase, 'insert', ticketFields)
        return res
    }

    const clearItems = () => {
        setTichetFields({
            id: null,
            title: '',
            description: '',
            attachFileName: '',
            type: Types[0].value,
            priority: priority[0].value,
            status: 'open',
            sender: globalVariables.userInfo.user.id,
            createDate: new Date(),
            lastUpdateDate: new Date()
        })
        setImageBase64('')
        setImageFileNmae('')
        document.getElementById('fileInput').value = '';
    }


    const handleGetBase64 = (base64, fileName) => {
        deleteOldFile().then(() => {
            setImageFileNmae(fileName)
            setImageBase64(base64)
            setTichetFields(prev => ({ ...prev, attachFileName: fileName }))
        })
    }

    const deleteOldFile = async () => {
        if (imageFileNmae !== '') {
            FileDeleter.FileDeleter(globalVariables.urlBase_Server, imageFileNmae)
        }
    }

    useEffect(() => {
        //  console.log(800, ticketFields);
    }, [ticketFields])

    return (
        <div className="NewTicket-component">



            <legend>NewTicket</legend>
            <div className="form-group">
                <input name="name"
                    value={globalVariables.userInfo.user.name || ''}
                    disabled
                    type="text" placeholder="Name" className="form-control input-md" required="" />
            </div>
            {Types &&
                <div className="form-group">
                    <select value={ticketFields.type} onChange={(e) => handlechange(e)} name="type" className="form-control">
                        {Types?.map((item, index) => {
                            return <option key={index} value={item.value}>{item.value}</option>
                        })}
                    </select>
                </div>
            }

            {priority &&
                <div className="form-group">
                    <select value={ticketFields.priority} onChange={(e) => handlechange(e)} name="priority" className="form-control">
                        {priority?.map((item, index) => {
                            return <option key={index} value={item.value}>{item.value}</option>
                        })}
                    </select>
                </div>
            }

            <div className="form-group">
                <input value={ticketFields.title} onChange={(e) => handlechange(e)} type='text' name="title" placeholder='title' className="form-control input-md" />
            </div>
            <div className="form-group">
                <textarea value={ticketFields.description} onChange={(e) => handlechange(e)} rows={5} className="form-control" name="description" placeholder='Describe your Ticket Please.'></textarea>
            </div>
            <div className="form-group">
                <FileUpload id={'fileInput'} handleGetBase64={handleGetBase64} />
                {imageBase64 && <img src={imageBase64} alt="Uploaded File" />}
            </div>

            <div className="form-group">
                <div style={{ position: 'relative' }}>
                    {showAlert === true && <Alert className={AlertType}
                        msg={AlertType === 'success' ? 'your ticket submitted' : 'your ticket Failed!'}
                        title={`${AlertType}!`} />}
                </div>
                {loading === false && <button onClick={handleSendTichet} className="btn-send">Send</button>}
                {loading === true &&
                    <>
                        <button onClick={handleSendTichet} className="btn btn-success" disabled>Send</button>
                        <div>
                            ...Loading
                        </div>
                    </>
                }
            </div>

        </div >
    );
};

export default NewTicket;