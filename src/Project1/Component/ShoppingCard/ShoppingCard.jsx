import React, { useEffect, useState } from 'react';
import './ShoppingCardStyle.scss'
import { Link } from 'react-router-dom'
import { useGlobalVariableContext } from '../../Context/GlobalVariableContext';
import CRUD from '../../Services/CRUD';
import axios from 'axios';
import Alert from '../Alert/Alert';

const ShoppingCard = ({ ShowForPortfolio }) => {


    const { globalVariables, updateGlobalVariables } = useGlobalVariableContext();
    const [totalPrice, setTotalPrice] = useState(0)
    const [totalOff, setTotalOff] = useState(0)
    const [totalPriceAfterOff, setTotalPriceAfterOff] = useState(0)
    const [summary, setSummary] = useState({})
    const [items, setItems] = useState([])
    const [refresh, setrefresh] = useState(false)
    const [refreshDelete, setRefreshDelete] = useState(false)
    const [showAlert, setShowAlert] = useState(false)
    const [AlertType, setAlertType] = useState('')
    const currency = '$'



    const fetchData = async () => {
        // console.log(10022);
        if (globalVariables.userInfo.user.id || ShowForPortfolio === true) {
            Promise.all([
                globalVariables.GetData_Mode === 'sql' ?
                    await CRUD.SQL_ExecuteQuery(`select * from shoppingCard where userID=${ShowForPortfolio === true ? 2 : globalVariables.userInfo.user.id}`, globalVariables.urlBase_Server, false)
                    : await CRUD.GetData(`${globalVariables.urlBase_DataBase}/shoppingCard?userID=${ShowForPortfolio === true ? 2 : globalVariables.userInfo.user.id}`),

                globalVariables.GetData_Mode === 'sql' ?
                    await CRUD.SQL_ExecuteQuery('select * from product', globalVariables.urlBase_Server, false)
                    : await CRUD.GetData(`${globalVariables.urlBase_DataBase}/product`),

                globalVariables.GetData_Mode === 'sql' ?
                    await CRUD.SQL_ExecuteQuery('select * from productImage', globalVariables.urlBase_Server, false)
                    : await CRUD.GetData(`${globalVariables.urlBase_DataBase}/productImage`),

                globalVariables.GetData_Mode === 'sql' ?
                    await CRUD.SQL_ExecuteQuery('select * from Filter_Product', globalVariables.urlBase_Server, false)
                    : await CRUD.GetData(`${globalVariables.urlBase_DataBase}/Filter_Product`),

                globalVariables.GetData_Mode === 'sql' ?
                    await CRUD.SQL_ExecuteQuery('select * from Filter_List', globalVariables.urlBase_Server, false)
                    : await CRUD.GetData(`${globalVariables.urlBase_DataBase}/Filter_List`),

                globalVariables.GetData_Mode === 'sql' ?
                    await CRUD.SQL_ExecuteQuery('select * from Filter_Value', globalVariables.urlBase_Server, false)
                    : await CRUD.GetData(`${globalVariables.urlBase_DataBase}/Filter_Value`),

            ]).then(([shoppingCardData, productData, imageData, filterData, filterlistData, filterValueData]) => {
                console.log(7, shoppingCardData);
                if (shoppingCardData) {
                    if (shoppingCardData.length > 0) {
                        const newShoppingCard = shoppingCardData?.map(shoppingcard => {
                            const product = productData && productData.find(p => p.id === shoppingcard.productID)
                            if (product) {
                                shoppingcard.productTitle = product.title
                            }

                            const image = imageData && imageData.find(p => p.productID === shoppingcard.productID)
                            if (image) {
                                shoppingcard.productImage = image.imgURL
                            }


                            const filter = filterData && filterData.filter(f => f.IDForUniq === shoppingcard.filtersIDForUniq
                                && f.ProductID === shoppingcard.productID)
                            //   console.log(44, filter);
                            if (filter) {
                                const filters = []
                                filter?.map(item => {
                                    // console.log(500,filterlistData,filter);
                                    // if (filter.) {

                                    // }

                                    const filterName = filterlistData && filterlistData.find(ite => ite.filter_id === item.Filter_ID)
                                    const filterValue = filterValueData && filterValueData.find(ite => ite.id === item.Filter_Value)
                                    //  console.log(3, filterName, filterValue);
                                    if (filterName && filterName.filter_name === 'count') {
                                        shoppingcard.allCount = item.Filter_Value
                                    }
                                    if (filterName && filterName.filter_name === 'price') {
                                        shoppingcard.firstPrice = item.Filter_Value
                                    }
                                    if (filterName && filterName.filter_name === 'off') {
                                        shoppingcard.off = item.Filter_Value
                                    }
                                    //  console.log(77,filterName,filterValue);
                                    if (filterName && filterValue) {
                                        let newfilter = {
                                            filterName: filterName.filter_name,
                                            filterValue: filterValue.value
                                        }
                                        filters.push(newfilter)
                                    }
                                })
                                shoppingcard.filters = filters
                            }


                            if (shoppingcard.firstPrice === undefined) {
                                shoppingcard.firstPrice = 0
                            }
                            return shoppingcard

                        })
                        //  console.log(2000, newShoppingCard);

                        setItems(newShoppingCard)

                        let totalPrice = 0
                        let totalOff = 0

                        newShoppingCard?.map(item => {
                            totalPrice += (item.firstPrice && item.count) ? parseInt(item.firstPrice) * parseInt(item.count) : 0
                            totalOff += (item.off && item.firstPrice) ? ((parseInt(item.firstPrice) * parseInt(item.off) / 100)) * parseInt(item.count) : 0
                        })

                        let totalPriceAfterOff = totalPrice - totalOff

                        setTotalPrice(totalPrice)
                        setTotalOff(totalOff)
                        setTotalPriceAfterOff(totalPriceAfterOff)

                    }
                    else {
                        setItems([])
                    }
                }

            })
        }
    }

    useEffect(() => {
        fetchData()
    }, [globalVariables.userInfo, ShowForPortfolio, refresh])


    // useEffect(() => {
    //     console.log(700);
    //     setItems([])
    // }, refreshDelete)

    useEffect(() => {
        console.log(2000, items);
    }, [items, showAlert])

    const handleNewQTY = async (e, item) => {
        if (globalVariables.env_mode !== "view") {
            const newValue = parseInt(e.target.value);
            // console.log(100, newValue);
            if (!isNaN(newValue)) {
                if (newValue <= item.allCount && newValue > 0) {
                    let newitem = { ...item, count: newValue } // Check if the input is a valid number
                    Promise.all([
                        globalVariables.GetData_Mode === 'sql' ?
                            await CRUD.SQl_Update(item.id, 'shoppingCard', globalVariables.urlBase_Server, newitem)
                            : await CRUD.AddEditData(item.id, 'shoppingCard', globalVariables.urlBase_DataBase, 'edit', newitem),

                    ]).then(([res]) => {
                        setrefresh(!refresh)
                    })
                }
            }
        }
    }

    const handleRemoveItem = async (id) => {
        if (globalVariables.env_mode !== "view") {
            let sqlcommand = `delete from shoppingCard where id=${id}`
            Promise.all([
                globalVariables.GetData_Mode === 'sql' ?
                    await CRUD.SQL_ExecuteQuery(sqlcommand, globalVariables.urlBase_Server, false)
                    : await CRUD.DeleteData(id, 'shoppingCard', globalVariables.urlBase_DataBase),

            ]).then(([res]) => {
                setrefresh(!refresh)
            })
        }
    }

    const handlePayment = async () => {
        if (globalVariables.env_mode !== "view") {
            try {
                const response = await axios.post(
                    `${globalVariables.urlBase_Server}/payment`,
                    {
                        recipient: 'bonshad Company',
                        amount: totalPrice,
                        currency: 'USD'
                    }
                );
                if (response.data.data === 200) {
                    // Create an array to hold all promises
                    let itemOrder = {
                        id: Math.floor(10000 + Math.random() * 90000),
                        userID: globalVariables.userInfo.user.id,
                        price: totalPrice,
                        discount: totalOff,
                        deliverPrise: 0,
                        paymentDate: new Date(),
                        paymentType: "online",
                        FollowPaymentID: Math.floor(10000 + Math.random() * 90000),
                        status: 'delivered'
                        // filtersDes: filtersDes[0]
                    };

                    const orderID = await AddToOrder(itemOrder);

                    const promises = items?.map(async (item) => {
                        const filtersDes = item.filters?.map(filter => `${filter.filterName} : ${filter.filterValue}   ,`);
                        const orderDetailsItem = {
                            id: Math.floor(10000 + Math.random() * 90000),
                            orderID: orderID,
                            productID: item.productID,
                            price: item.firstPrice,
                            discount: item.off,
                            payPrice: (parseInt(item.firstPrice)) - (item.off ? ((parseInt(item.firstPrice) * parseInt(item.off) / 100)) : 0),
                            deliverPrise: 0,
                            FollowPaymentID: Math.floor(10000 + Math.random() * 90000),
                            filtersDes: filtersDes[0],
                            productImage: item.productImage,
                            productTitle: item.productTitle,
                            productCount: item.count
                        };
                        await AddToOrderDetails(orderDetailsItem);
                        await DeleteItemFromShoppingCard(item.id);
                    });

                    // Wait for all promises to resolve
                    await Promise.all(promises);

                    // All operations completed successfully
                    setItems([]);
                    updateGlobalVariables({
                        renderShoppingCard: !globalVariables.renderShoppingCard
                    });
                    setAlertType('success');
                    setShowAlert(true);
                } else {
                    setAlertType('danger');
                    setShowAlert(true);
                }
            } catch (error) {
                console.error('Error processing payment:', error);
                setAlertType('danger');
                setShowAlert(true);
            }
        }
    }


    const AddToOrder = async (item) => {
        if (globalVariables.GetData_Mode === 'sql') {
            delete item.id
        }
        const res = globalVariables.GetData_Mode === 'sql' ?
            await CRUD.SQl_Insert('orders', globalVariables.urlBase_Server, item)
            : await CRUD.AddEditData(null, 'orders', globalVariables.urlBase_DataBase, 'insert', item)
        // console.log(1, res,res.id);
        return res.id
    }
    const AddToOrderDetails = async (item) => {
        if (globalVariables.GetData_Mode === 'sql') {
            delete item.id
        }
        const res = globalVariables.GetData_Mode === 'sql' ?
            await CRUD.SQl_Insert('orderDetails', globalVariables.urlBase_Server, item)
            : await CRUD.AddEditData(null, 'orderDetails', globalVariables.urlBase_DataBase, 'insert', item)
        // console.log(2, res);
        return res
    }
    const DeleteItemFromShoppingCard = async (itemId) => {

        let sqlcommand = `delete from shoppingCard where id=${itemId}`

        const res = globalVariables.GetData_Mode === 'sql' ?
            await CRUD.SQL_ExecuteQuery(sqlcommand, globalVariables.urlBase_Server, false)
            : await CRUD.DeleteData(itemId, 'shoppingCard', globalVariables.urlBase_DataBase)
        //   console.log(3, res);
        return res
    }

    const itemsShow = items && items?.map((item, index) => {
        console.log(88, items);
        //  console.log(1000, items, item);
        let PriceAfterOff = (parseInt(item.firstPrice)) - (item.off ? ((parseInt(item.firstPrice) * parseInt(item.off) / 100)) : 0)
        return <div className="product" key={index}>
            <div className="row">
                <div className="col-4 col-md-2">
                    <img className="img-fluid mx-auto d-block image" src={`${globalVariables.imageBasePath}/${item.productImage}`} />
                </div>
                <div className="col-8 col-md-5">
                    <div className='product-name'> {item.productTitle}</div>
                    <div>
                        {item.filters?.map((filter, index) => {
                            return <div key={index} className='shop-filters'>
                                {filter.filterName} : {filter.filterValue}
                            </div>
                        })}
                    </div>
                </div>
                
                <div className='col-4 d-md-none'></div>
                <div className="col-3 col-md-2">
                    <p className='total-count'> Total Count:{item.allCount}</p>
                    <input type="number" onChange={(e) => handleNewQTY(e, item)} value={item.count} className="form-control" />
                </div>
                <div className="col-5 col-md-2">
                    <div className="price">
                        {item.off && <span className="original-price">{parseInt(item.firstPrice) * parseInt(item.count)}{currency}
                            <span className="ribbon">{`${item.off}%`}</span>
                        </span>
                        }
                        <br />
                        {<span className="discounted-price">{parseInt(PriceAfterOff) * parseInt(item.count)}{currency}</span>}
                    </div>
                </div>
            </div>
            <i onClick={() => handleRemoveItem(item.id)} className='fa fa-remove product-close'></i>
            <hr className='hr-items' />
        </div>
    })


    const showSummary = () => {

        return <div className="summary">
            <h3>Summary</h3>
            <div className="summary-item"><span className="text">Subtotal</span><span className="price">{totalPrice}{currency}</span></div>
            <div className="summary-item"><span className="text">Discount</span><span className="price">{totalOff}{currency}</span></div>
            <div className="summary-item"><span className="text">Total</span><span className="price">{totalPriceAfterOff}{currency}</span></div>
            <button onClick={() => handlePayment()} type="button" className="btn btn-primary btn-lg btn-block"> Confirm and Pay</button>
        </div>
    }

    return (
        <main className="ShoppingCard-component">
            <section className="shopping-cart dark">
                <div className="container">
                    <div className="content">
                        <div className="row">
                            {items.length <= 0 && <><br /><br /><p>Loading...</p></>}
                            {items.length > 0 &&
                                <>
                                    <div className="col-md-12 col-lg-8">
                                        <div className="items ">
                                            {/* <div className="row">
                                        <div className="col-2"></div>
                                        <div className="col-5"></div>
                                        <div className="col-2">Quantity</div>
                                        <div className="col-2">Price</div>
                                    </div> */}
                                            {itemsShow}
                                            {showAlert === true &&
                                                <div className="div-Alert">
                                                    <Alert className={AlertType}
                                                        msg={AlertType === 'success' ? 'your Response submitted' : 'your Response Failed!'}
                                                        title={`${AlertType}!`} /></div>}
                                        </div>
                                    </div>
                                    <div className="col-md-12 col-lg-4">
                                        {showSummary()}
                                    </div>
                                </>}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default ShoppingCard;