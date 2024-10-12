import React, { useEffect, useState } from 'react';
import './SimilarItemsStyle.scss'
import CRUD from '../../Services/CRUD'
import { useGlobalVariableContext } from '../../Context/GlobalVariableContext'

const SimilarItems = ({ count }) => {
    const { globalVariables, updateGlobalVariables } = useGlobalVariableContext();

    const [similartItems, setSimilartItems] = useState([])
    const [loading, setLoading] = useState(false)


    let conditionSilmilar = '1=1 '
    globalVariables.mainGroup?.map((item, index) => {
      
        conditionSilmilar += ` or Products_MainGroup.mainGroupID=${item.mainGroupID} `
    })
 
    const sqlCommand_sililarItems = `select top ${count}
    product.id 
    ,title
    ,REPLACE(description, '&', '\\u0026') as description
    ,selectOption
    ,New
    ,offTag
    ,(select top 1 imgURL 
        from productImage
        where productID=product.id
         FOR JSON PATH) as images
    from product 
    inner join Products_MainGroup 
	on product.id=Products_MainGroup.product_id
    and ( ${conditionSilmilar} )
    FOR JSON PATH, INCLUDE_NULL_VALUES
 `

    const fetchDataJson = async (API_Address) => {
        setLoading(false)
        Promise.all([
            await CRUD.GetData(`${globalVariables.urlBase_DataBase}/product`),
            await CRUD.GetData(`${globalVariables.urlBase_DataBase}/Products_MainGroup`),
            await CRUD.GetData(`${globalVariables.urlBase_DataBase}/productImage`),
        ]).then(([productData, Products_MainGroupData, productImageData]) => {
            const similarItems = Products_MainGroupData.filter(item => globalVariables.mainGroup.some(idObj => idObj.mainGroupID === item.mainGroupID));
            const topCountSimilarItems = similarItems.slice(0, count);
            let data = []
            let newitem = {}
            topCountSimilarItems?.map(item => {
                newitem = productData.find(ite => ite.id === item.product_id)
                let image = productImageData.find(ite => ite.productID = newitem.id)
                newitem.images = image
                data.push(newitem)
            })

            setLoading(true)
            data && setSimilartItems(data)
        })
    }

    const fetchDataSQL = async (sqlcommand) => {
        setLoading(false)
        const data = await CRUD.SQL_ExecuteQuery(sqlcommand, globalVariables.urlBase_Server, true)
        console.log(54, data);
        if (data) {
            console.log(55, data);
            setLoading(true)
            data && setSimilartItems(data)
        }
    }

    useEffect(() => {
        globalVariables.GetData_Mode === 'sql' ? fetchDataSQL(sqlCommand_sililarItems) : fetchDataJson()
    }, [count, globalVariables.mainGroup])

    useEffect(() => {
        // console.log(700, similartItems);
    }, [similartItems])

    const similarItemsShow = similartItems && similartItems?.map(item => {
        //   console.log(800, item);
        return <div className="d-flex mb-3">
            <a href="" className="me-3">
                <img src={item.images && `${globalVariables.imageBasePath}/${item.images[0].imgURL}`} className="img-md img-thumbnail img2" />
            </a>
            <div className="info">
                <a href="" className="nav-link mb-1">
                    {item.title}
                </a>
                <strong className="text-dark"></strong>
            </div>
        </div>
    })

    return <>
        <div className="similarItems-component">
            {loading === false && <div><p>Loading...</p></div>}
            {loading === true && (similartItems && similartItems.length <= 0) && <div className='comment'><p>No SimilarItems For Show!</p></div>}
            {loading === true && (similartItems && similartItems.length > 0) &&
                <>
                    {similarItemsShow}
                </>
            }
        </div>
    </>
};

export default SimilarItems;