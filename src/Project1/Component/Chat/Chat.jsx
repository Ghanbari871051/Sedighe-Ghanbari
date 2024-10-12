import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import './ChatStyle.scss'
import { useGlobalVariableContext } from '../../Context/GlobalVariableContext'
import SocketIOClient from 'socket.io-client'
import { useLocation } from 'react-router-dom';


function Chat({ margin }) {
    const { globalVariables, updateGlobalVariables } = useGlobalVariableContext();

    const [newMessage, setNewMessage] = useState('')
    const [messages, setMessages] = useState([])

    const chatScroll = useRef()
    const socket = React.useRef(SocketIOClient.connect(`${globalVariables.urlBase_Server}/api/socket`, { transports: ['websocket'], withCredentials: true }));
    //  const socket = SocketIOClient.connect('http://localhost:3001/socket', { transports: ['websocket'], withCredentials: true })
    //  const [socket, setSocket] = useState(null)

    const location = useLocation();

    // Accessing state passed from the previous screen
    const { name, gender } = location.state || {};


    // props.history.push({
    //     pathname:"Chat",
    //     state:{
    //         name:'sgh',
    //         gender:1
    //     }
    // })

    useEffect(() => {
        const handleNewMessage = (data) => {
            //   console.log(5, data);
            setMessages(messages => messages.concat(data));
            //      console.log(100, messages);
            chatScroll.current.scroll(0, chatScroll.current.scrollHeight)
        };

        const handleDeleteMessage = (id) => {
            // Use the previous state to make sure you are working with the latest state
            setMessages(prevMessages => {
                // Filter out the message with the given id
                const newArray = prevMessages.filter(item => item.id !== id);
                //  console.log(200, prevMessages, id, newArray);
                //  console.log(300, prevMessages, id, newArray);
                // chatScroll.current.scroll(0, chatScroll.current.scrollHeight + 40)
                return newArray;
            });
        };

        socket.current.on("newMessage", handleNewMessage);
        socket.current.on("deleteMsg", handleDeleteMessage);

        return () => {
            // Cleanup function to remove the event listener
            socket.current.off("newMessage", handleNewMessage);
            socket.current.off("deleteMsg", handleDeleteMessage);
        };
    }, [socket.current, setMessages]);

    const handleNewMessage = (e) => {
        //  console.log(e);
        setNewMessage(e.target.value)
    }

    const handleSendMessage = () => {
        //   console.log(1);
        if (newMessage === undefined)
            return

        socket.current.emit("newMessage", {
            msg: newMessage,
            sender: {
                name: name,
                gender: gender
            }
        })

        setNewMessage('')

    }

    const handleDeleteMsg = (id) => {
        //   console.log(100, id);
        socket.current.emit("deleteMsg", id)
    }

    const messagesShow = messages?.map(item => {
        if (item.sender.name !== name) {
            return <div className="incoming">
                {item.sender.name}
                <div className="bubble">{item.msg}
                    <br />{item.date.split('T')[1].split('.')[0]}
                    <i className='fa fa-trash' onClick={() => handleDeleteMsg(item.id)}></i></div>
            </div>
        }
        else {
            return <div className="outgoing">
                <div className="bubble lower">{item.msg}
                    <br />{item.date.split('T')[1].split('.')[0]}
                    <i className='fa fa-trash' onClick={() => handleDeleteMsg(item.id)}></i></div>
                {item.sender.name}
            </div>
        }
    })

    const handleEnterKey = (e) => {
        // console.log(e);
        if (e.key === 'Enter' && newMessage !== '') {
            handleSendMessage()
        }
    }
    return (
        <>
            {/* https://csshint.com/html-css-chat-box-designs/ */}
            <div style={{ margin: `${margin}` }} className="chat-component">
                <div className="chatbox">
                    <div className="top-bar">
                        <div className="avatar"><p>V</p></div>
                        <div className="name">Chat</div>
                        <div className="icons">
                            <i className="fa fa-phone"></i>
                            <i className="fa fa-video-camera"></i>
                        </div>
                        <div className="menu">
                            <div className="dots"></div>
                        </div>
                    </div>
                    <div className="middle">
                        <div className="voldemort" ref={chatScroll}>
                            {messagesShow}

                            <div className="typing">
                                <div className="bubble">
                                    <div className="ellipsis one"></div>
                                    <div className="ellipsis two"></div>
                                    <div className="ellipsis three"></div>
                                </div>
                            </div>


                        </div>
                    </div>
                    <div className="bottom-bar">
                        <div className="chat">
                            <input className='txtChat' onKeyDown={(e) => handleEnterKey(e)} type="text" value={newMessage} onChange={(e) => handleNewMessage(e)} placeholder="Type a message..." />
                            <button className='btnChat' type="submit" onClick={() => handleSendMessage()}><i className="fa fa-paper-plane"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Chat;