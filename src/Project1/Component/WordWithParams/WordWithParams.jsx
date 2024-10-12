import React from 'react';
import { saveAs } from 'file-saver';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

function WordGenerator() {
    const generateDocument = () => {
        // Load the template document
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'wordSample.docx', true);
        xhr.responseType = 'arraybuffer';

        xhr.onload = function () {
            const templateData = new Uint8Array(xhr.response);
            const zip = new PizZip(templateData);
            const doc = new Docxtemplater();
            doc.loadZip(zip);

            // Set image data
            const imageData1 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD//gA7Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2ODApLCBxdWFsaXR5ID0gOTUK/9sAQwACAQEBAQECAQEBAgICAgIEAwICAgIFBAQDBAYFBgYGBQYGBgcJCAYHCQcGBggLCAkKCgoKCgYICwwLCgwJCgoK/9sAQwECAgICAgIFAwMFCgcGBwoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoK/8AAEQgBqgKqAwEi'; // Base64 encoded image data
            const imageData2 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD//gA7Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2ODApLCBxdWFsaXR5ID0gOTUK/9sAQwACAQEBAQECAQEBAgICAgIEAwICAgIFBAQDBAYFBgYGBQYGBgcJCAYHCQcGBggLCAkKCgoKCgYICwwLCgwJCgoK/9sAQwECAgICAgIFAwMFCgcGBwoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoK/8AAEQgBqgKqAwEi'; // Base64 encoded image data

            // Set data to be filled in the document
            const data = {
                name: 'John Doe',
                email: 'john@example.com',
                image1: { data: imageData1, width: 100, height: 100 }, // Adjust width and height as needed
                image2: { data: imageData2, width: 150, height: 150 }, // Adjust width and height as needed
                // Add other dynamic data as needed
            };

            // Render the document
            doc.setData(data);
            doc.render();

            // Save the filled document
            const output = doc.getZip().generate({ type: 'blob' });
            saveAs(output, 'generated_document.docx');
        };

        xhr.send();
    };

    return (
        <div>
            <h1>Generate Word Document</h1>
            <button onClick={generateDocument}>Generate Document</button>
        </div>
    );
}

export default WordGenerator;
