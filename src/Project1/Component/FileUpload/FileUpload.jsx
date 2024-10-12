import React, { useState } from 'react';
import './FileUploadStyle.scss';
import { useGlobalVariableContext } from '../../Context/GlobalVariableContext';
import axios from 'axios';

function FileUpload({ handleGetBase64,id }) {
  const { globalVariables, updateGlobalVariables } = useGlobalVariableContext();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    uploadFile(selectedFile);
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${globalVariables.urlBase_Server}/api/uploadFile`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      const fileName = response.data.filename;
    //  console.log('File uploaded successfully:', response.data);
      fetchFile(fileName);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };


  const fetchFile = async (fileName) => {

    //  console.log(88,`${globalVariables.UploadFileBasePath_Server}/${fileName}`);

    const response = await axios.get(`${globalVariables.UploadFileBasePath_Server}/${fileName}`, {
      responseType: 'arraybuffer',
    });
    //console.log(response);
    const base64String = btoa(
      new Uint8Array(response.data).reduce((data, byte) => {
        return data + String.fromCharCode(byte);
      }, '')
    );
    //setImageUrl(`data:image/jpeg;base64,${base64String}`);
    handleGetBase64(`data:image/jpeg;base64,${base64String}`,fileName)
    //  console.log(`data:image/jpeg;base64,${base64String}`);
  }

  return (
    <div>
      <input type="file" id={id} onChange={handleFileChange} />
    </div>
  );
}

export default FileUpload;
