
import axios from 'axios';

const FileDeleter = async (urlBase_Server,fileName) => {
    try {
     
        const response = await axios.delete(`${urlBase_Server}/api/delete-file/${fileName}`);
      
    } catch (error) {
       // console.error('Error deleting file:', error);
        // Handle error, e.g., show an error message to the user
    }
};



export default {FileDeleter} ;
