
import React, { useEffect, useState } from 'react';
import './ProductCardStyle.scss'
import QuickView from './ProductCardQuickView/ProductCardQuickView';
import FiveStar from '../FiveStar/FiveStar';
import { useGlobalVariableContext } from '../../Context/GlobalVariableContext'
import queryString from 'query-string'; // Install the 'query-string' library if you haven't
import ShareURL from '../ShareURL/ShareURL';
import productFunction from './productFunction';
import AddToCard from '../ShoppingCard/AddToCard';
import CRUD from '../../Services/CRUD';



function ProductCard(props) {

    const { globalVariables, updateGlobalVariables } = useGlobalVariableContext();
    //const [product, setProduct] = useState([])
    const [Allproduct, setAllProduct] = useState()
    const [productItem, setProductItem] = useState()
    const [clickedQuickView, setClickedQuickView] = useState(false)
    const [typeUpdateItems, settypeUpdateItems] = useState('')


    const API_BaseURL = `${globalVariables.urlBase_Server}`

    const sqlCommand_tableName = `select
    id
    ,title
    ,REPLACE(description, '&', '\\u0026') as description
    ,selectOption
    ,New
    ,offTag
    ,(select imgURL 
        from productImage
        where productID=product.id
         FOR JSON PATH) as images
    from product 
        FOR JSON PATH `



    const sqlProductFilters = (id) => {
        // (select  DISTINCT Filter_Value
        //      FROM Filter_Product AS sub
        //      WHERE sub.ProductID = mt.ProductID AND sub.IDForUniq = mt.IDForUniq and sub.Filter_ID=1002
        //  ) AS count ,
        const sql = ` SELECT
            DISTINCT ProductID, IDForUniq,
             (
                 SELECT DISTINCT Filter_ID,(select DISTINCT filter_name from Filter_List where filter_id=sub.Filter_ID)as FilterIDName,
                 Filter_Value,(select DISTINCT value from Filter_Value where id=sub.Filter_Value)as FilterValueName
                 FROM Filter_Product AS sub
                 WHERE sub.ProductID = mt.ProductID AND sub.IDForUniq = mt.IDForUniq
                 FOR JSON PATH
             ) AS filters
         FROM 
             Filter_Product AS mt
         WHERE 
             mt.ProductID = ${id}
         FOR JSON PATH;
          `
        return sql
    }


    const handleQuickView = async (item) => {
        setProductItem(item)
        setClickedQuickView(true)
    }

    const closeModal = () => {
        setClickedQuickView(false)
    }

    const fetchData = async () => {
        if (globalVariables.GetData_Mode === 'sql') {
            let data = await CRUD.SQL_ExecuteQuery(sqlCommand_tableName, globalVariables.urlBase_Server, true)
            if (data) {
                // Add a new field to each object in the data
                const modifiedData = data?.map(item => ({
                    ...item,
                    ModalSelectedOption: false, // Add your new field and its value here
                }));
                //  console.log(7000, modifiedData);
                setAllProduct(modifiedData)
                // console.log(130, modifiedData);
            }
        }
        if (globalVariables.GetData_Mode === 'json') {
            Promise.all([
                await CRUD.GetData(`${globalVariables.urlBase_DataBase}/product`),
                await CRUD.GetData(`${globalVariables.urlBase_DataBase}/productImage`)
                // fetchDataJson(`${globalVariables.urlBase_DataBase}/ticketResponses`)
            ]).then(([data_product, data_productImage]) => {
                console.log(1455428980, data_productImage, data_product);
                const data = data_product?.map(product => {
                    const images = data_productImage.filter(image => image.productID === product.id)?.map(image => image.imgURL) || ['2.jpg'];
                    console.log(45, images);


                    return {
                        id: product.id,
                        title: product.title,
                        description: product.description.replace(/&/g, '\\u0026'),
                        selectOption: product.selectOption,
                        New: product.New,
                        offTag: product.offTag,
                        images: images && images?.length > 0 ? images : ['2.jpg', '1.jpg']
                    };
                });
                if (data) {
                    // Add a new field to each object in the data
                    const modifiedData = data?.map(item => ({
                        ...item,
                        ModalSelectedOption: false, // Add your new field and its value here
                    }));
                    //  console.log(7000, modifiedData);
                    setAllProduct(modifiedData)
                    // console.log(130, modifiedData);
                }

            })
        }
    }
    useEffect(() => {
        fetchData()
    }, [])


    useEffect(() => {
    }, [productItem, typeUpdateItems])


    const updateModalSelectedOption = (itemId) => {
        // Create a new array with the updated field value
        const updatedItems = Allproduct?.map((item) =>
            item.id === itemId ? { ...item, ModalSelectedOption: !item.ModalSelectedOption } : item
        );
        setAllProduct(updatedItems); // Update the state with the new array
    }

    const handleQuickView_viewDetails = (item) => {
        closeModal()
        // setProductItem(item)
        setClickedQuickView(false)
        const params = {
            productID: item.id,
            //  productFilters: JSON.stringify(convertedArrayproductFilters),
        }

        const newTabUrl = `/${globalVariables.ProjectName}/ProductCardDetails?${queryString.stringify(params)}`;
        // Open the link in a new tab using the anchor element and triggering a click
        const anchor = document.createElement('a');
        anchor.href = newTabUrl;
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';  // Recommended for security
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
    }


    const Filter_ID_Price = 1003
    const [prices, setPrices] = useState({});

    const FetchDataProductFilter = async (id) => {
        Promise.all([
            await CRUD.GetData(`${globalVariables.urlBase_DataBase}/Filter_Product?ProductID=${id}`),
            await CRUD.GetData(`${globalVariables.urlBase_DataBase}/Filter_Product`),
            await CRUD.GetData(`${globalVariables.urlBase_DataBase}/Filter_List`),
            await CRUD.GetData(`${globalVariables.urlBase_DataBase}/Filter_Value`),
            // fetchDataJson(`${globalVariables.urlBase_DataBase}/ticketResponses`)
        ]).then(([filteredProductData, Filter_Product, Filter_List, Filter_Value]) => {

            const getFilterName = filterId => {
                const filter = Filter_List.find(filter => filter.filter_id === filterId);
                return filter ? filter.filter_name : null;
            };

            // Function to get filter value name based on Filter_Value
            const getFilterValue = filterValueId => {
                const filterValue = Filter_Value.find(value => value.id === filterValueId);
                return filterValue ? filterValue.value : null;
            };

            const result = filteredProductData?.map(item => {
                const filters = Filter_Product.filter(subItem => subItem.ProductID === item.ProductID && subItem.IDForUniq === item.IDForUniq)?.map(subItem => ({
                    Filter_ID: subItem.Filter_ID,
                    FilterIDName: getFilterName(subItem.Filter_ID),
                    Filter_Value: subItem.Filter_Value,
                    FilterValueName: getFilterValue(subItem.Filter_Value)
                }));

                return {
                    ProductID: item.ProductID,
                    IDForUniq: item.IDForUniq,
                    filters: filters
                };
            });

            return result

        })
    }

    const getPrice = async (id) => {

        try {
            let data = []
            if (globalVariables.GetData_Mode === 'sql') {
                data = await CRUD.SQL_ExecuteQuery(sqlProductFilters(id), API_BaseURL, true)

            }
            if (globalVariables.GetData_Mode === 'json') {
                data = await FetchDataProductFilter(id)
            }

            let price = -1;

            console.log(77, data);
            data && data.forEach(ite => {
                ite.filters?.map(item => {
                    if (item.Filter_ID === Filter_ID_Price) {
                        price = price === -1 ? item.Filter_Value : item.Filter_Value && item.Filter_Value < price ? item.Filter_Value : price;
                    }
                });
            });

            return price;
        } catch (error) {
            console.error('Error fetching price:', error);
            return -1;
        }
    };

    useEffect(() => {
        const fetchPrices = async () => {
            const pricesObject = {};
            Allproduct && await Promise.all(Allproduct?.map(async (item) => {
                const price = await getPrice(item.id);
                pricesObject[item.id] = price;
            }));
            setPrices(pricesObject);
        };

        fetchPrices();
    }, [Allproduct]);

    const cards = Allproduct && Allproduct?.map((item) => {
        //  console.log(100,item);

        return <div className="col-12 col-sm-6 col-md-4">
            <div className="card">
                <div className="card1">
                    <div className="div-img">
                        <img src={item.images && `${globalVariables.imageBasePath}/${item.images.length > 0 && item.images[0]}`} alt="Denim Jeans" className="card-img" />
                        <div className="map">
                            <img src={item.images && `${globalVariables.imageBasePath}/${item.images.length > 1 ? item.images[1] : item.images.length > 0 && item.images[0]}`} className="card-img-hover" />
                        </div>
                        {item.offTag === 'OFF' && <div className="offTag">{item.offTag}</div>}
                        {item.New === 'New' && <div className="newTag">{item.New}</div>}
                        <div className="QuickView" onClick={() => handleQuickView(item)}>
                            <i className='fa fa-search'></i>
                            <div className="QuickView-text">
                                Quick View
                            </div>
                        </div>

                        <div className="card-action-buttons">
                            <a href="" className=" faClass fa fa-facebook"></a>
                            <a href="" className="faClass fa fa-twitter"></a>
                            <a href="" className="faClass fa fa-google"></a>
                        </div>
                        {item.ModalSelectedOption === true &&
                            <div className='div-select-option'>
                                <i onClick={() => updateModalSelectedOption(item.id)} className='close fa fa-close'></i>
                                <br />
                                <br />
                                <p>add filter in here</p>
                                <AddToCard productID={item.id} />
                            </div>}
                    </div>

                    <div className='link' onClick={() => handleQuickView_viewDetails(item)} target='_blank'>
                        <div className='title'>{item.title}</div>
                        <div className='description'>{item.description}</div>
                    </div>

                    <div className="price">${prices[item.id]}</div>
                    <div className="Myrating">
                        <FiveStar type={'show'} />
                        <i className='heart fa fa-heart'></i>
                        {/* <i className='share fa fa-share-alt' ></i> */}
                        <i className='share'> <ShareURL /></i>
                    </div>
                    {item.selectOption === false &&
                        <>
                            <button ><AddToCard productID={item.id} className={'addtocard'} /></button>
                        </>
                    }
                    {item.selectOption === true && <button onClick={() => handleQuickView(item)}>Select Option</button>}
                </div>
            </div>
        </div>



    })


    return (
        <>
            <div className="productcard-component">

                {clickedQuickView === true &&
                    <>
                        <div id="overlay" className="overlay">
                            <div className='my_modal'>
                                <div className="my_modal-content quickviewModal">
                                    <QuickView
                                        productID={productItem.id}
                                        closeModal={closeModal}
                                        handleViewDetails={handleQuickView_viewDetails}
                                    />
                                </div>
                            </div>
                        </div>
                        {/* <!-- The overlay --> */}

                    </>
                }

                <div className="row">
                    {cards}
                </div>


            </div>
        </>
    );
}

export default ProductCard;