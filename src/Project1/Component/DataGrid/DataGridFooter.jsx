import React from 'react';

function DataGridFooter({ headerFields, sum }) {

    const footerItems = headerFields && headerFields?.map((item, index) => {
        if (item.access === true) {
            if (item.visible === true) {
                if (item.key === 'age') {
                    return <td key={index}>{sum}</td>
                }
                return <td key={index}></td>
            }
        }
    })

    return (
        <tr>
            {footerItems}
        </tr>
    );
}

export default DataGridFooter;