
import './CommentStyle.scss'
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import CRUD from '../../Services/CRUD'
import { useGlobalVariableContext } from '../../Context/GlobalVariableContext'

function Comment({ id, margin }) {
console.log(4657);

    const { globalVariables, updateGlobalVariables } = useGlobalVariableContext();
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(false)
    // const mainGroupID = globalVariables.mainGroup && globalVariables.mainGroup[0]
    const [replyText, setReplyText] = useState(''); // State to store the textarea value



    const fetchDataJson = async (API_Address) => {
        return await CRUD.GetData(API_Address)
    }
    const fetchDataSQL = async (sqlcommand) => {
        const data = await CRUD.SQL_ExecuteQuery(sqlcommand, globalVariables.urlBase_Server, true)
        return data
    }

    useEffect(() => {
        setLoading(false)
        if (globalVariables.GetData_Mode === 'json') {

            Promise.all([
                fetchDataJson(`${globalVariables.urlBase_DataBase}/Comments?productID=${id}`),
                fetchDataJson(`${globalVariables.urlBase_DataBase}/Users`),
                // fetchDataJson(`${globalVariables.urlBase_DataBase}/ticketResponses`)
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
                    setLoading(true)
                    setComments(newComments?.filter(n => n !== undefined));
                }
            })
        }

        if (globalVariables.GetData_Mode === 'sql') {
            //console.log(1000, id);
            if (id) {
               // console.log(1001, id);
                const sql_Get_Comments = `
                SELECT
                id,
                  date,
                time,
                comment,
                productID,
                commentID,
                senderID,
                parentID,
                    icon,
                url,
				(select name from Users where id=c.senderID) as name,
				(select avatar from Users where id=c.senderID) as avatar
              FROM
                Comments c
              WHERE
                productID = ${id}
              FOR JSON PATH, INCLUDE_NULL_VALUES
                            `

                fetchDataSQL(sql_Get_Comments).then((data) => {
                    //    console.log(28, data);
                    setLoading(true)
                    // console.log("data", data);
                    data && setComments(data)
                    // console.log(comments);
                })
            }

        }
    }, [id])

    useEffect(() => {
          console.log(29, comments);
    }, [comments])
    const handleSendReply = (itemId) => {
        // Do something with the replyText, e.g., send it to the server
        //    console.log('Sending reply:', replyText, itemId);

        // Clear the textarea after sending, if needed
        setReplyText('');
    };

    const createComments = (id) => {
        //  console.log(5, id);
        if (comments && comments.filter(x => x.parentID === id).length === 0) {
            const item = comments.filter(x => x.id === id)[0]
           // console.log(222, item);
            return <li key={id}>
                <div className="comment-main-level">
                    <div className="comment-avatar"><img src={`${globalVariables.imageBasePath}/${item.avatar}`} alt="" /></div>
                    <div className="comment-box">
                        <div className="comment-head">
                            <h6 className="comment-name"><a href="">{item.name}</a></h6>
                            <span className="posted-time">Posted on {item.date}{item.time}</span>
                            {/* <i className="fa fa-reply"></i>
                            <i className="fa fa-heart"></i> */}
                        </div>
                        <div className="comment-content">
                            {item.comment}
                            <div className="comment-open">
                                <a className="btn-reply" data-bs-toggle="collapse" data-bs-target={`#footer${item.id}`}>
                                    <i className="fa fa-reply"></i>
                                </a>
                            </div>
                        </div>
                        <div className="comment-footer collapse collapse-ul" id={`footer${item.id}`}>
                            <div className="comment-form">
                                <textarea className="form-control" value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)} ></textarea>
                                <div className="pull-right send-button" onClick={() => handleSendReply(item.id)}>
                                    <a className="btn-send">send</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </li >
        }

        if (comments && comments.filter(x => x.parentID === id).length > 0) {
            const item = comments.filter(x => x.id === id)[0]
            // console.log(223, item, item.id);
            return <li key={id}>
                <div className="comment-main-level">

                    <div className="comment-avatar"><img src={`${globalVariables.imageBasePath}/${item.avatar}`} alt="" /></div>

                    <div className="comment-box">
                        <div className="comment-head">
                            <h6 className="comment-name"><a href="">{item.name}</a></h6>
                            <span className="posted-time">Posted on {item.date} {item.time}</span>
                            {/* <i className="fa fa-reply" ></i>
                            <i className="fa fa-heart"></i> */}
                        </div>
                        <div className="comment-content">
                            {item.comment}
                            <div className="comment-open">
                                <a className="btn-reply" data-bs-toggle="collapse" data-bs-target={`#footer${item.id}`}>
                                    <i className="fa fa-reply"></i>
                                </a>
                            </div>
                        </div>
                        <div className="comment-footer collapse collapse-ul" id={`footer${item.id}`}>
                            <div className="comment-form">
                                <textarea className="form-control" value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)} ></textarea>
                                <div className="pull-right send-button" onClick={() => handleSendReply(item.id)}>
                                    <a className="btn-send">send</a>
                                </div>
                            </div>
                        </div><button type="button" className="btn btn-link showReply" data-bs-toggle="collapse" data-bs-target={`#demo${item.id}`}> Show Reply
                        </button>
                    </div>
                </div>


                <ul className="comments-list reply-list collapse collapse-ul" id={`demo${item.id}`}>
                    {comments && comments.filter(x => x.parentID === id)?.map((item) => {
                        return (
                            createComments(item.id)
                        )
                    }
                    )}
                </ul>
            </li>

        }
    }

    const commentsShow = comments && comments?.map((item) => {

        if (item && item.parentID === null) {
            //   console.log(30, item);
            return createComments(item.id)
        }
    })

    return (
        <>
            {loading === false && <div style={{ margin: `${margin}` }} className='comment-component'><p>Loading...</p></div>}
            {loading === true && (comments && comments.length <= 0) && <div style={{ margin: `${margin}` }} className='comment-component'><p>No Comments For Show!</p></div>}
            {loading === true && (comments && comments.length > 0) &&
                <>
                    <div style={{ margin: `${margin}` }} className='comment-component'>
                        <div className="row">
                            <div className="col-12">
                                <div className="comments-container">
                                    <h1>User Comments</h1>
                                    <ul id="comments-list" className="comments-list">
                                        {commentsShow}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            }
        </>
    );
}

export default Comment;