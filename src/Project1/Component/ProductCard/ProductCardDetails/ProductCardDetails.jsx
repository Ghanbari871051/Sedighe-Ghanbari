import React, { useState, useLayoutEffect, useEffect } from 'react';
import './ProductCardDetailsStyle.scss'
import { useParams, useLocation } from 'react-router-dom';
import FiveStar from '../../FiveStar/FiveStar';
import Comment from '../../../Component/Comment/Comment'
import SimilarItems from '../../SimilarItems/SimilarItems';
import ShareURL from '../../ShareURL/ShareURL';
import Favorite from '../../Favorite/Favorite';
import { useGlobalVariableContext } from '../../../Context/GlobalVariableContext'
import CRUD from '../../../Services/CRUD';
import AddToCard from '../../ShoppingCard/AddToCard';

function ProductDetails({ productID = 1 }) {

    const { globalVariables, updateGlobalVariables } = useGlobalVariableContext();
    const [productFilters, setproductFilters] = useState([])
    const [productItem, setProductItem] = useState([])
    const [productImages, setproductImages] = useState([])
    const [productFilterMainTbl, setproductFilterMainTbl] = useState([])
    const location = useLocation();
    const [productHaveFilter, setProductHaveFilter] = useState(false)
    //  const searchParams = new URLSearchParams(location.search);

    const sqlCommand_GetProduct = `select
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
     where id=${productID}
        FOR JSON PATH `


    // const productFiltersMain = JSON.parse(searchParams.get('productFilters'));

    const arrayToOriginalObject = (arr) => {
        const originalObject = {};
        arr.forEach((item) => {
            const key = Object.keys(item)[0];
            originalObject[key] = item[key];
        });
        return originalObject;
    };

    //const productFilters = arrayToOriginalObject(productFiltersMain)
    // const images = JSON.parse(searchParams.get('images'));


    const [imageSelect, setImageSelect] = useState();
    const [filtersValue, setFiltersValue] = useState({});
    const [newQTY, setnewQTY] = useState(1)
    const [TotalSelled, setTotalSelled] = useState(154)
    const API_BaseURL = `${globalVariables.urlBase_Server}`

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


    const sqlImages = (id) => {
        const sql = `select id , productID,imgURL 
        from productImage
        where productID=${id}
         FOR JSON PATH`

        return sql
    }

    const fetchDataAfterJsonSQL = (productData, filterData, imageData) => {
        // console.log(1000, productData, filterData, imageData);
        if (productData.length > 0) {
            setProductItem(productData[0])
        }
        if (imageData) {
            const newimages = imageData?.map(item => ({
                ...item,
                imgURL: `${globalVariables.imageBasePath}/${item.imgURL}`, // Add your new field and its value here
            }));
            setproductImages(newimages)
            setImageSelect(newimages[0].imgURL)
        }
        // console.log(88, filterData);
        if (filterData) {
            setproductFilterMainTbl([])
            const result = filterData.reduce((acc, item) => {
                const newItem = {
                    IDForUniq: item.IDForUniq,
                };
                // Extract dynamic filter names from the data
                const filterNames = [...new Set(item.filters?.map(filter => filter.FilterIDName))];
                filterNames.forEach(filterName => {
                    const filter = item.filters.find(filter => filter.FilterIDName === filterName);
                    if (filter) {
                        //  console.log(5, filter.FilterValueName);
                        newItem[filterName] = filter.FilterValueName ? filter.FilterValueName : filter.Filter_Value;
                    }
                });
                acc.push(newItem);
                return acc;
            }, []);
            setproductFilterMainTbl(result)


            const filterName = []
            result?.map(item => {
                const keys = Object.keys(item)
                keys.forEach(item => {
                    if (filterName.includes(item) === false) {
                        filterName.push(item)
                    }
                })
            })

            setproductFilters([])
            const result2 = []
            const filtersList = result?.map((item) => {
                filterName.forEach(fname => {
                    //  console.log(1, acc[fname], item[fname]);
                    if (fname !== 'count' && fname !== 'price') {
                        if (!result2[fname]) {
                            result2[fname] = []
                        }
                        //  console.log(200,result2[fname]);
                        item[fname] && result2[fname].some(obj => obj.item === item[fname]) === false && result2[fname].push({ item: item[fname] })
                    }
                })
            })
            setproductFilters(result2)
            setProductHaveFilter(true)
        }
    }

    const fetchDataSQL = async () => {
        Promise.all([
            CRUD.SQL_ExecuteQuery(sqlCommand_GetProduct, API_BaseURL, true),
            CRUD.SQL_ExecuteQuery(sqlProductFilters(productID), API_BaseURL, true),
            CRUD.SQL_ExecuteQuery(sqlImages(productID), API_BaseURL, true)
        ]).then(([productData, filterData, imageData]) => {
            fetchDataAfterJsonSQL(productData, filterData, imageData)
        })
    }

    const fetchDataJson = async () => {
        Promise.all([
            await fetchProductData_json(),
            await fetchFilterData_Json(),
            await CRUD.GetData(`${globalVariables.urlBase_DataBase}/productImage?productID=${productID}`)
        ]).then(([productData, filterData, imageData]) => {
            fetchDataAfterJsonSQL(productData, filterData, imageData)
        })
    }

    const fetchProductData_json = async () => {
        Promise.all([
            await CRUD.GetData(`${globalVariables.urlBase_DataBase}/product?id=${productID}`),
            await CRUD.GetData(`${globalVariables.urlBase_DataBase}/productImage`),

        ]).then(([data_product, data_productImage]) => {
            const data = data_product?.map(product => {
                const images = data_productImage.filter(image => image.productID === product.id)?.map(image => image.imgURL);

                return {
                    id: product.id,
                    title: product.title,
                    description: product.description.replace(/&/g, '\\u0026'),
                    selectOption: product.selectOption,
                    New: product.New,
                    offTag: product.offTag,
                    images: images
                };
            });
            return data
        })
    }

    const fetchFilterData_Json = async (id) => {
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


    useEffect(() => {
        globalVariables.GetData_Mode === 'sql' ? fetchDataSQL() : fetchDataJson()
    }, [productID, globalVariables.urlBase_Server])

    const handleQTY = () => {
        //    console.log(200);
        const data = productFilterMainTbl
        const filters = filtersValue
        const filteredData = data.filter && data.filter(item => {
            return Object.entries(filters).every(([key, value]) => {
                return (value && value !== '') ? item[key] === value : true;
            });
        });

        // console.log(700, filteredData);
        let count = 0
        let price = 0
        filteredData !== undefined && filteredData?.map(item => {
            count += item.count !== undefined && item.count
            price = price === 0 ? item.price : item.price < price ? item.price : price
        })

        //  console.log(200, filteredData);
        // console.log(50, count);
        setQTY(count)
        setPrice(price)
    }
    const [QTY, setQTY] = useState(0)
    const [price, setPrice] = useState(0)

    const setImage = (imgURL) => {
        setImageSelect(imgURL);
    };
    const imagesShow = productImages && productImages?.map(item => {
        return <img width="60" height="60" className="rounded-2 imgList" src={item.imgURL} onClick={() => setImage(item.imgURL)} />

    })

    const handleFilterChange = (key, value) => {
        setFiltersValue(prevValues => ({ ...prevValues, [key]: value }));
        //  handleChangeFilters(filtersValue)

    }

    useEffect(() => {
        handleQTY()
    }, [QTY, filtersValue])

    useEffect(() => {
        handleQTY()
    }, [productFilters, productFilterMainTbl])

    const handleNewQTY = (e) => {
        if (e.target.value <= QTY && e.target.value >= 1) {
            setnewQTY(e.target.value)
        }
    }

    const filtersShow = () => {
        //   console.log(productHaveFilter);
        if (productHaveFilter === true) {
            const keys = Object.keys(productFilters);
            //  console.log(100);
            return keys?.map((key, index) => {

                if (key !== "count") {

                    const filterOptions = productFilters[key];
                    const filterValue = filtersValue[key] || `--any ${key}--`;

                    return (
                        <div className="col-md-4 col-sm-6 col-xs-12" key={index}>
                            {key}
                            <select
                                className="form-control"
                                name="select"
                                value={filterValue}
                                onChange={(e) => handleFilterChange(key, e.target.value)}
                            >
                                <option value="" defaultValue>--any {key}--</option>
                                {filterOptions?.map((filter, index) => (
                                    <option key={index} value={filter.item}>
                                        {filter.item}
                                    </option>
                                ))}
                            </select>
                        </div>
                    );
                }

                return null;
            });
        }
        return null;
    };


    const [tabLi, setTabli] = useState('tab1'); // Set the default active tab
    const [key, setKey] = useState('tab1'); // Set the default active tab

    const tabsShow = () => {
        return <>
            <div>
                <ul className="nav nav-pills tab-ul">
                    <li className="nav-item" >
                        <a name='tab1' onClick={(e) => { setTabli('tab1') }} className={`nav-link ${tabLi ==='tab1'  ? 'active' : ''}`}>Comments</a>
                    </li>
                    <li className="nav-item" >
                        <a name='tab2' onClick={(e) => { setTabli('tab2') }} className={`nav-link ${tabLi === 'tab2' ? 'active' : ''}`}>Specification</a>
                    </li>
                    <li className="nav-item">
                        <a name='tab3' onClick={(e) => { setTabli('tab3') }} className={`nav-link ${tabLi === 'tab3' ? 'active' : ''}`}>Warranty info</a>
                    </li>
                    <li className="nav-item">
                        <a name='tab4' onClick={(e) => { setTabli('tab4') }} className={`nav-link ${tabLi === 'tab4' ? 'active' : ''}`} >Shipping info</a>
                    </li>
                    <li className="nav-item">
                        <a name='tab5' onClick={(e) => { setTabli('tab5') }} className={`nav-link ${tabLi === 'tab5' ? 'active' : ''}`}> Seller profile</a>
                    </li>
                </ul>

                <div className="tab-content">
                    <div className={`tab-pane fade ${tabLi === 'tab1' ? 'show active' : ''}`} name="tab1">
                        <Comment id={productItem.id} />
                    </div>
                    <div className={`tab-pane fade ${tabLi === 'tab2' ? 'show active' : ''}`} name="tab2">
                        <p>
                            With supporting text below as a natural lead-in to additional content. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                            enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                            pariatur.
                        </p>
                        <div className="row mb-2">
                            <div className="col-12 col-md-6">
                                <ul className="list-unstyled mb-0">
                                    <li><i className="fa fa-check text-success me-2"></i>Some great feature name here</li>
                                    <li><i className="fa fa-check text-success me-2"></i>Lorem ipsum dolor sit amet, consectetur</li>
                                    <li><i className="fa fa-check text-success me-2"></i>Duis aute irure dolor in reprehenderit</li>
                                    <li><i className="fa fa-check text-success me-2"></i>Optical heart sensor</li>
                                </ul>
                            </div>
                            <div className="col-12 col-md-6 mb-0">
                                <ul className="list-unstyled">
                                    <li><i className="fa fa-check text-success me-2"></i>Easy fast and ver good</li>
                                    <li><i className="fa fa-check text-success me-2"></i>Some great feature name here</li>
                                    <li><i className="fa fa-check text-success me-2"></i>Modern style and design</li>
                                </ul>
                            </div>
                        </div>
                        <table className="table border mt-3 mb-2">
                            <tr>
                                <th className="py-2">Display:</th>
                                <td className="py-2">13.3-inch LED-backlit display with IPS</td>
                            </tr>
                            <tr>
                                <th className="py-2">Processor capacity:</th>
                                <td className="py-2">2.3GHz dual-core Intel Core i5</td>
                            </tr>
                            <tr>
                                <th className="py-2">Camera quality:</th>
                                <td className="py-2">720p FaceTime HD camera</td>
                            </tr>
                            <tr>
                                <th className="py-2">Memory</th>
                                <td className="py-2">8 GB RAM or 16 GB RAM</td>
                            </tr>
                            <tr>
                                <th className="py-2">Graphics</th>
                                <td className="py-2">Intel Iris Plus Graphics 640</td>
                            </tr>
                        </table>
                    </div>
                    <div className={`tab-pane fade ${tabLi === 'tab3' ? 'show active' : ''}`}name="tab3">
                        2-Tab content or sample information now <br />
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                        aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
                        officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                        nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                    </div>
                    <div className={`tab-pane fade ${tabLi === 'tab4' ? 'show active' : ''}`}name="tab4">
                        3-Another tab content or sample information now <br />
                        Dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
                        mollit anim id est laborum.
                    </div>
                    <div className={`tab-pane fade ${tabLi === 'tab5' ? 'show active' : ''}`}name="tab5">
                        4-Some other tab content or sample information now <br />
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                        aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
                        officia deserunt mollit anim id est laborum.
                    </div>
                </div>
            </div>
        </>
    }


    return (
        <>
            <div className="ProductDetails">
                {/* <div className="AlertDivFoeAlertComponent">
                    <Alert className={'info'} msg={'This alert box indicates a successful or positive action.'} title={'Info SGH'}/>
                </div> */}
                <section className="py-5">
                    <div className="row gx-5">
                        <aside className="col-lg-6">
                            <div className="border rounded-4 mb-3 d-flex justify-content-center">
                                <img className="rounded-4 fit" src={imageSelect} />

                            </div>
                            <div className="d-flex justify-content-center mb-3">
                                {imagesShow}
                            </div>
                            {/* <!-- thumbs-wrap.// --> */}
                            {/* <!-- gallery-wrap .end// --> */}
                        </aside>
                        <main className="col-lg-6">
                            <div className="ps-lg-3">
                                <h4 className="title text-dark">
                                    {productItem.id}
                                    {productItem.title}
                                </h4>
                                <div className="d-flex flex-row my-3">
                                    <div className="text-share mb-1 me-2">
                                        <ShareURL />

                                    </div>
                                    <div className="text-warning mb-1 me-2">
                                        <FiveStar type={'show'} showRate={true} />
                                    </div>
                                    <span className="text-muted"><i className="fa fa-shopping-basket fa-sm mx-1"></i>{TotalSelled} orders</span>
                                    <span className="text-success ms-2">In stock</span>
                                </div>

                                <div className="mb-3">
                                    <span className="h5">Price: {productItem.price}</span>
                                    <span className="text-muted">${price}</span>
                                </div>

                                <p>
                                    {productItem.description}
                                </p>

                                {/* <div className="row">
                                        <dt className="col-3">Type:</dt>
                                        <dd className="col-9">Regular</dd>

                                        <dt className="col-3">Color</dt>
                                        <dd className="col-9">Brown</dd>

                                        <dt className="col-3">Material</dt>
                                        <dd className="col-9">Cotton, Jeans</dd>

                                        <dt className="col-3">Brand</dt>
                                        <dd className="col-9">Reebook</dd>
                                    </div> */}

                                <hr />

                                <div className="row">
                                    {filtersShow()}
                                    <div className="col-md-4 col-sm-12 filterItem">
                                        Total QTY: {QTY}
                                        {QTY === 0 && <input type="number" className="form-control" value={0} disabled />}
                                        {QTY > 0 && <input type="number" className="form-control" value={newQTY} onChange={(e) => handleNewQTY(e)} />}
                                    </div>
                                    {/* <!-- end col --> */}
                                </div>
                                <div className="row" style={{ marginTop: '20px' }}>
                                    <div className="col-12">
                                        <a href="" className="btn btn-warning shadow-0 mybtn"> Buy now </a>
                                        <a href="" className="btn btn-primary shadow-0 mybtn">
                                            <i className="me-1 fa fa-shopping-basket"></i>
                                            <AddToCard productID={productID} count={parseInt(newQTY, 10)} />
                                        </a>
                                        <a ><Favorite productID={productItem.id} className={'my-Heart'} /></a>

                                    </div>
                                </div>

                            </div>
                        </main>
                    </div>
                </section>
                {/* <!-- content-- > */}


                <section className="bg-light border-top py-4">
                    <div className="container">
                        <div className="row gx-4">
                            <div className="col-lg-8 mb-4">
                                <div className="border rounded-2 px-3 py-2 bg-white">
                                    {tabsShow()}
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="px-0 border rounded-2 shadow-0">
                                    <div className="card">
                                        <div className="card-body">
                                            <h5 className="card-title">Similar items</h5>
                                            {<SimilarItems count={5} />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

export default ProductDetails;