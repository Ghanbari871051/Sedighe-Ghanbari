
import axios from 'axios';

// const DeleteItems = async (idsToDelete, tableName, API_BaseURL) => {
//     //const idsToDelete = [1, 2, 3];
//     try {
//         const response = await axios.delete(`${API_BaseURL}/${tableName}`, { data: { ids: idsToDelete } });
//         console.log('Items deleted successfully:', response.data);
//         return response.data; // Return any relevant data from the server response
//     } catch (error) {
//         console.error('Error deleting items:', error);
//         throw error; // Rethrow the error to handle it further if needed
//     }
// };

const DeleteData = async (id, tableName, API_BaseURL) => {
    
    return await axios.delete(`${API_BaseURL}/${tableName}/${id}`)
        .then(response => {
            //  console.log('Data delete successfully:');
            return 'success'
        })
        .catch(error => {
            console.error('Error deleting data:', error);
        });
}

// const GetData1 = async (API_Address, IDss) => {
//     const IDs = IDss// [{ mainGroupID: '12' }, { mainGroupID: '2' }, { mainGroupID: '3' }]//req.body['mainGrouID'];
//     const k = await axios.get(API_Address)
//         .then(res => res.data)
//     // [
//     //     {
//     //         "id": 20,
//     //         "name": "AProject_1",
//     //         "icon": "fa fa-info",
//     //         "url": "AProject_1",
//     //         "mainGroupID": "1",
//     //         "parentID": null
//     //     },
//     //     {
//     //         "id": 21,
//     //         "name": "GenerateFakeData",
//     //         "icon": "fa fa-info",
//     //         "url": "GenerateFakeData",
//     //         "mainGroupID": "1",
//     //         "parentID": null
//     //     }
//     // ]

//     const result = IDs && k?.map(item => {
//         const p = IDs?.map(id => {
//             // console.log(item.mainGroupID, id.mainGroupID)
//             if (item.mainGroupID === id.mainGroupID) {
//                 return item
//             }
//         })
//         return p.filter(n => n !== undefined)[0]
//     })
//     return result

// }

const AddEditData = async (id, tableName, API_BaseURL, type, item) => {
    try {
        let response;
        if (type === 'edit') {
            response = await axios.put(`${API_BaseURL}/${tableName}/${id}`, item);
        } else if (type === 'insert') {
            response = await axios.post(`${API_BaseURL}/${tableName}`, item);
            if (response.data && response.data.id) {
                return { status: 'success', id: response.data.id } // Return the id
            } else {
                throw new Error('Response does not contain the id.');
            }
        }

        //   console.log('Data updated successfully:', response.data);
        return 'success';
    } catch (error) {
        console.error('Error updating data:', error);
        return 'error';
    }
};


const GetData = async (API_Address) => {

    try {


        // بررسی اینکه آیا آدرس به یک فایل JSON اشاره دارد
        if (API_Address.startsWith('file://')) {
            const filePath = API_Address.replace('file://', ''); // حذف 'file://' از مسیر

            // استخراج نام جدول و پارامترها
            const tableNameWithParams = filePath.split('/').pop(); // نام جدول به همراه پارامترها
            const tableName = tableNameWithParams.split('?')[0]; // نام جدول بدون پارامترها
            const params = new URLSearchParams(tableNameWithParams.split('?')[1]); // پارامترهای پرس و جو

            // ساخت jsonPath
            const jsonPath = filePath.replace(`/${tableNameWithParams}`, ''); // حذف نام جدول از مسیر

            // دریافت داده‌ها
            const response = await fetch(jsonPath);
            const data = await response.json();

            // فیلتر کردن داده‌ها بر اساس پارامترهای پرس و جو
            let filteredData = data[tableName];

            if (params.toString()) {
                filteredData = filteredData.filter(item => {
                    for (const [key, value] of params) {
                        if (item[key] !== value) {
                            return false; // اگر یکی از فیلترها برقرار نیست، آن مورد حذف می‌شود
                        }
                    }
                    return true; // مورد به شرط‌ها پاسخ می‌دهد
                });
            }

            console.log(356, filteredData);
            return filteredData;

        } else {
            console.log("hugeuyfge");
            
            return await axios.get(API_Address)
                .then(res => res.data)
                .catch(error => {
                    console.log("1254856");
                    
                    return null
                });
        }
    } catch (error) {
        console.error('Error:', error);
        return null;
    }

}

const SQL_ExecuteQuery = async (sqlCommand, API_BaseURL, ForJsonPath, sgh) => {

    let newsql = sqlCommand
    if (typeof sqlCommand === 'string') {
        newsql = sqlCommand.replace(/\n/g, '');
    }
    //console.log(7777, sqlCommand, newsql, ForJsonPath);
    const params = {
        sqlCommand: newsql

    };

    // console.log(70, `${API_BaseURL}/SQL_ExecuteQuery`);
    return axios.get(`${API_BaseURL}/SQL_ExecuteQuery`, { params })
        .then(response => {
            //  console.log(33, newsql, response.data);
            let data = []
            if (ForJsonPath === true) {
                let jsonString = response.data[0][Object.keys(response.data[0])];
                data = jsonString && JSON.parse(jsonString);
            }
            else {
                data = response.data
            }
            //console.log(71,data);
            return data;
        })
        .catch(error => {
            console.error(55, window.location.href, newsql, sgh, '55,Error:', error);
            throw error; // Rethrow the error or handle it accordingly
        })
}


const SQl_Insert = async (tableName, API_BaseURL, dataToInsert) => {
    // const dataToInsert = {
    //     firstname: 'Luz',
    //     lastname: 'Koelpin',
    //     age: 3,
    //     tell: '1-562-465-8584 x0822',
    //     city: 1,
    //   };
    const params = {
        dataToInsert: dataToInsert,
        tableName: tableName,
    }
    const r = axios.post(`${API_BaseURL}/SQL_Insert`, params)
        .then(response => {
            //console.log(response.data.data);
            return response
        })
        .catch(error => {
            console.error('Error:', error);
            return null
        });
    return r
}


const SQl_Update = async (id, tableName, API_BaseURL, dataToUpdate) => {
    // const dataToInsert = {
    //     firstname: 'Luz',
    //     lastname: 'Koelpin',
    //     age: 3,
    //     tell: '1-562-465-8584 x0822',
    //     city: 1,
    //   };

    const params = {
        id: id,
        dataToUpdate: dataToUpdate,
        tableName: tableName,
    }
    // console.log(333,params);
    axios.put(`${API_BaseURL}/SQL_Update`, params)
        .then(response => {
            //console.log(response.data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


export default { DeleteData, AddEditData, GetData, SQl_Insert, SQl_Update, SQL_ExecuteQuery }