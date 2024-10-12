import React, { useEffect } from 'react';


function View({ item, closeModal, headerFields_Name }) {

    const columnNames = Object.keys(item);
    const showResult = columnNames?.map((field, index) => {
        //  console.log(field, Array.isArray(item[field]));
        if (Array.isArray(item[field]) === false) {
            const name = headerFields_Name.find(i => i.name === field)
            return <p key={`${item[field]}${index}`}>{name ? name.headerNameShow : field}:{item[field]}</p>
        }
    })

    useEffect(() => {

    }, [item])

    return (
        <div className="Modal-DataGridComponent">
            <div className='my_modal'>
                <div className="my_modal-content">
                    <a href="" onClick={() => closeModal()}> <i className='fa fa-close close'></i></a>
                    <h2>view</h2>
                    {showResult}
                    <br />
                    <button onClick={() => closeModal()}>Close</button>
                </div>
            </div>
        </div>
    );
}

export default View;