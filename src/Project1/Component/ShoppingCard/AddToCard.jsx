import React from 'react';
import { useGlobalVariableContext } from '../../Context/GlobalVariableContext'
import CRUD from '../../Services/CRUD';

const AddToCard = ({ className, text, productID, filtersIDForUniq, count, filters }) => {

    //   console.log(45,filtersIDForUniq);
    const { globalVariables, updateGlobalVariables } = useGlobalVariableContext();

    const handleClick = async (productID) => {
        if (globalVariables.env_mode !== "view") {
            let item = {
                id: Math.floor(10000 + Math.random() * 90000),
                productID: productID,
                userID: globalVariables.userInfo.user.id,
                count: count ? count : 1,
                filtersIDForUniq: filtersIDForUniq ? filtersIDForUniq[0].IDForUniq : null,
                CreateDate: new Date()
            }
            if (globalVariables.GetData_Mode === 'sql') {
                delete item.id
            }
            Promise.all([
                globalVariables.GetData_Mode === 'sql' ?
                    await CRUD.SQl_Insert('shoppingCard', globalVariables.urlBase_Server, item)
                    : await CRUD.AddEditData(null, 'shoppingCard', globalVariables.urlBase_DataBase, 'insert', item),
            ]).then((res) => {
                //   console.log(1111,res);
                if (res[0].status === 'success') {
                    updateGlobalVariables({
                        renderShoppingCard: !globalVariables.renderShoppingCard
                    })
                }
            })
        }
    }

    return (
        <span
            onClick={() => handleClick(productID)}
            className={`${className}`}>
            {text ? text : 'Add to Cart'}
        </span>
    );
};

export default AddToCard;