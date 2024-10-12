import React, { useEffect, useState } from 'react';
import './ProductCardQuickViewStyle.scss'
import FiveStar from '../../FiveStar/FiveStar';
import { useLayoutEffect } from 'react';
import { useGlobalVariableContext } from '../../../Context/GlobalVariableContext'
import productFunction from '../productFunction';
import AddToCard from '../../ShoppingCard/AddToCard';
import CRUD from '../../../Services/CRUD';


function QuickView({ productID, closeModal, handleViewDetails }) {

    const { globalVariables, updateGlobalVariables } = useGlobalVariableContext();

    // console.log(3, productFilters, productFilterMainTbl);
    const [imageSelect, setImageSelect] = useState();
    const [filtersValue, setFiltersValue] = useState({});
    const [newQTY, setnewQTY] = useState(1)
    const [productFilters, setproductFilters] = useState([])
    const [productItem, setProductItem] = useState([])
    const [productHaveFilter, setProductHaveFilter] = useState([])
    const [productImages, setproductImages] = useState([])
    const [productFilterMainTbl, setproductFilterMainTbl] = useState([])
    const [filteredData, setFilteredData] = useState([])


    const API_BaseURL = `${globalVariables.urlBase_Server}`
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
        //  console.log(200, productFilterMainTbl, filtersValue);
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
        setFilteredData(filteredData)
    }
    const [QTY, setQTY] = useState(0)
    const [price, setPrice] = useState(0)
    const setImage = (imgURL) => {
        setImageSelect(imgURL);
    };
    const imagesShow = productImages && productImages?.map(item => {
        return <img className="img-responsive all_image" src={item.imgURL} onClick={() => setImage(item.imgURL)} />
    })

    const handleFilterChange = (key, value) => {
        setFiltersValue(prevValues => ({ ...prevValues, [key]: value }))
    }


    useLayoutEffect(() => {
        handleQTY()
    }, [filtersValue])

    useEffect(() => {
        handleQTY()
    }, [QTY, filtersValue, productFilters])

    const handleNewQTY = (e) => {
        if (e.target.value <= QTY && e.target.value >= 1) {
            setnewQTY(e.target.value)
        }
    }

    const filtersShow = () => {
        if (productHaveFilter === true) {
            const keys = Object.keys(productFilters);
            return keys?.map((key, index) => {
                if (key !== "count" && key != "IDForUniq") {
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


    return (
        <>
            <div className='queikView'>
                <div className="row inner">
                    <i className='fa fa-close' onClick={closeModal}></i>
                    <div className="col-md-6 product_img">
                        <div className="row">
                            <div className="col-3 all_image-div">
                                {imagesShow}
                            </div>
                            <div className="col-9">
                                <img className="img-responsive" src={imageSelect} />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 product_content">
                        <h4>{productItem.title} <span></span></h4>
                        <FiveStar type={'show'} />
                        <p>{productItem.description}</p>
                        <h3 className="cost">
                            <span className="glyphicon glyphicon-usd"></span>
                            {productItem.price}
                            <small className="pre-cost">
                                <span className="glyphicon glyphicon-usd"></span>
                                ${price}
                            </small>
                        </h3>
                        <div className="row">
                            {filtersShow()}
                            <div className="col-md-4 col-sm-12">
                                Total QTY: {QTY}
                                {QTY === 0 && <input type="number" className="form-control" value={0} disabled />}
                                {QTY > 0 && <input type="number" className="form-control" value={newQTY} onChange={(e) => handleNewQTY(e)} />}


                            </div>
                            {/* <!-- end col --> */}
                        </div>
                        <div className="space-ten"></div>
                        <div className="btn-ground">
                            <button type="button" className="btn btn-success"
                                disabled={QTY > 0 ? false : true}
                            >
                                <AddToCard productID={productID} filtersIDForUniq={filteredData} count={parseInt(newQTY, 10)} />
                            </button>
                            <button type="button" onClick={() => handleViewDetails(productItem)} className="btn btn-success btn_view"><span className="glyphicon glyphicon-shopping-cart"></span> View Details</button>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default QuickView;