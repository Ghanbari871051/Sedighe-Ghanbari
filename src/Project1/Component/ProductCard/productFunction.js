import CRUD from "../../Services/CRUD";

const FetchData = async (sqlCommand,API_BaseURL) => {
    //  const url = `${globalVariables.urlBase_Server}/product`
    //  await fetch(url)
    //      .then(function (response) { return response.json(); })
    //     .then(function (data) {
    //          if (data.length > 0) {

    // Table
    let tabelData = null
    const tableData = await CRUD.SQL_ExecuteQuery(sqlCommand, API_BaseURL)
    //if use  FOR JSON PATH
    const jsonString = tableData.data && tableData.data[0][Object.keys(tableData.data[0])];
    const data = jsonString && JSON.parse(jsonString);


    // if not use  FOR JSON PATH
    //  const data = tableData.data
   // console.log(7, data);
    if (tableData && data.length > 0) {
        return data
    }
    return null
}

export default { FetchData }