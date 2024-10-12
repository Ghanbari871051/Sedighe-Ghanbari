import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useGlobalVariableContext } from '../../Context/GlobalVariableContext'
import FileUpload from '../FileUpload/FileUpload';
import CRUD from '../../Services/CRUD'
import Alert from '../Alert/Alert';
import FileDeleter from '../FileUpload/FileDeleter';
import PublicFunction from '../../Services/PublicFunction'
import Modal from '../Modal/Modal';

const OrderDetails = () => {


    const { globalVariables, updateGlobalVariables } = useGlobalVariableContext();


    const location = useLocation();
    const { orderID } = location.state;
    const [msg, setMsg] = useState('')
    const [imageFileNmae, setImageFileNmae] = useState('');
    const [imageBase64, setImageBase64] = useState('');
    const [order, setOrder] = useState([])
    const [showAlert, setShowAlert] = useState(false)
    const [AlertType, setAlertType] = useState('')
    const [refresh, setRefresh] = useState(false)
    const [showModal, setshowModal] = useState(false);
    const currency = '$'

    const fetchDataJson = async () => {
        Promise.all([
            CRUD.GetData(`${globalVariables.urlBase_DataBase}/orders?id=${orderID}`),
            CRUD.GetData(`${globalVariables.urlBase_DataBase}/Users`),
            CRUD.GetData(`${globalVariables.urlBase_DataBase}/orderDetails?orderID=${orderID}`),
        ]).then(([orderData, usersData, orderDetailsData, productData, imageData]) => {
            //  console.log(4, orderData, orderDetailsData, productData, imageData);
            if (orderData && usersData) {
                const order = orderData[0]
                const newOrder = () => {
                    const user = usersData.find(user => user.id === order.userID);
                    if (user) {
                        order.name = user.name;
                        order.avatar = user.avatar;
                    }
                    if (orderDetailsData) {
                        order.orderDetails = orderDetailsData;
                    }
                    return order;
                }
                setOrder(newOrder);
            }
        })
    }

    const fetchDataSQL = async () => {
        
        const sqlcommand =  ` SELECT *,
         (select name from Users where id=o.userID)as name,
         (select avatar from Users where id=o.userID)as avatar,
         (select * from orderDetails where orderID=o.id for JSON path) as orderDetails  
         from orders o
         where o.id=${orderID}
         for json path`

        Promise.all([
            await CRUD.SQL_ExecuteQuery(sqlcommand, globalVariables.urlBase_Server, true)
        ]).then(([orderData]) => {
            setOrder(orderData[0]);
        })
    }

    useEffect(() => {
        globalVariables.GetData_Mode === 'sql' ? fetchDataSQL() : fetchDataJson()
    }, [orderID,globalVariables,order])

    useEffect(() => {
           console.log(456, order);
    }, [order])

    const handleShowAttachFile = async (fileName) => {
        setImageBase64('')
        const base64 = await PublicFunction.ImageBase64(globalVariables.UploadFileBasePath_Server, fileName)
        setImageBase64(base64)
        setshowModal(true)
    }

    const closeModal = () => {
        setshowModal(false);
    };

    const itemsShow = order && order.orderDetails && order.orderDetails?.map((item, index) => {
        //  console.log(1000, items, item);
        let PriceAfterOff = (parseInt(item.firstPrice)) - (item.off ? ((parseInt(item.firstPrice) * parseInt(item.off) / 100)) : 0)
        return <div className="product" key={index}>
            <div className="row">
                <div className="col-4 col-md-2">
                    <img className="img-fluid mx-auto d-block image" src={`${globalVariables.imageBasePath}/${item.productImage}`} />
                </div>
                <div className="col-8 col-md-5">
                    <div className='product-name'> {item.productTitle}</div>
                </div>
                <div className="col-6 col-md-2">
                    <p className='total-count'> Count {item.allCount}</p>
                    <span>{item.productCount}</span>
                </div>
                <div className="col-6 col-md-2">
                    <div className="price">
                        <span className="original-price">{parseInt(item.price) * parseInt(item.productCount)}{currency}
                            {item.discount && <span className="ribbon">{`${item.discount}%`}</span>}
                        </span>
                        <br />
                        {item.discount && <span className="discounted-price">{item.payPrice}{currency}</span>}
                    </div>
                </div>
            </div>
            <hr className='hr-items' />
        </div>
    })


    const showSummary = () => {
          console.log(6000, order);
        let totalPriceAfterOff = parseInt(order.price) - parseInt(order.discount)

        let dateString = order.paymentDate;
        let dateObject = new Date(dateString);
        let paymentDate = !isNaN(dateObject.getDate()) && `${dateObject.getMonth()}-${dateObject.getDay()}-${dateObject.getFullYear()}`

        return <div className="summary">
            <h3>Payment Details</h3>
            <div className="summary-item"><span className="text">ID</span><span className="price">{order.id}</span></div>
            <div className="summary-item"><span className="text">Name</span><span className="price">{order.name}</span></div>
            <div className="summary-item"><span className="text">PaymentDate</span><span className="price">{paymentDate}</span></div>
            <div className="summary-item"><span className="text">PaymentType</span><span className="price">{order.paymentType}</span></div>
            <div className="summary-item"><span className="text">FollowPaymentID</span><span className="price">{order.FollowPaymentID}</span></div>
            <div className="summary-item"><span className="text">Status</span><span className="price">{order.status}</span></div>
            <div className="summary-item"><span className="text">Price</span><span className="price">{order.price}{currency}</span></div>
            <div className="summary-item"><span className="text">Discount</span><span className="price">{order.discount}{currency}</span></div>
            <div className="summary-item"><span className="text">TotalPay</span><span className="price">{totalPriceAfterOff}{currency}</span></div>
        </div>
    }


    return (
        <main className="ShoppingCard-component">
            <section className="shopping-cart dark">
                <div className="container">
                    <div className="content">
                        <div className="row">
                            <div className="col-md-12 col-lg-8">
                                <div className="items ">
                                    {/* <div className="row">
                                        <div className="col-2"></div>
                                        <div className="col-5"></div>
                                        <div className="col-2">Quantity</div>
                                        <div className="col-2">Price</div>
                                    </div> */}
                                    {itemsShow}
                                </div>
                            </div>
                            <div className="col-md-12 col-lg-4">
                                {order && showSummary()}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default OrderDetails;