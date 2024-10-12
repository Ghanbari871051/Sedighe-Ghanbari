
import axios from 'axios';

const ImageBase64 = async (API_BaseURL, fileName) => {
    //console.log(100, `${API_BaseURL}/${fileName}`);
    const response = await axios.get(`${API_BaseURL}/${fileName}`, {
        responseType: 'arraybuffer',
    });

    const base64String = btoa(
        new Uint8Array(response.data).reduce((data, byte) => {
            return data + String.fromCharCode(byte);
        }, '')
    );
    return `data:image/jpeg;base64,${base64String}`
}


// Function to add commas to a number
function addCommasToNumber(number) {
    // Convert number to string and add commas
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Function to remove commas from a number
function removeCommasFromNumber(numberWithCommas) {
    // Remove commas from the string
    return numberWithCommas.replace(/,/g, "");
}

// Example usage
// const numberWithCommas = addCommasToNumber(1234567); // Output: "1,234,567"
// console.log(numberWithCommas);

// const numberWithoutCommas = removeCommasFromNumber("1,234,567"); // Output: "1234567"
// console.log(numberWithoutCommas);

export default { ImageBase64, addCommasToNumber, removeCommasFromNumber }