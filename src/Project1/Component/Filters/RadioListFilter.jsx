import React from 'react';

function RadioListFilter({ ItemList, handleItem, title }) {

    // console.log(852);
    const items = ItemList?.map(item => {
        return <div key={item.id} className="form-check">
            {item.checked === true && <input type="radio" name={`#RadioGroupName_${title}`} onChange={() => handleItem(item.id, title)} className="form-check-input" checked />}
            {item.checked === false && <input type="radio" name={`#RadioGroupName_${title}`} onChange={() => handleItem(item.id, title)} className="form-check-input" />}

            <label className="form-check-label" htmlFor="check1">{item.value}</label>
            {/* <i className='color' style={{ backgroundColor: item.brandName }}></i> */}
        </div >
    })
    return (
        <div className="filterItem">
            <a className="btn btn-primary title" data-bs-toggle="collapse" href={`#collapseFilter${title}`} role="button" aria-expanded="false" aria-controls="collapseExample">
                {title}
            </a>
            <div className="collapse" id={`collapseFilter${title}`}>
                <div className="card card-body">
                    {items}
                </div>
            </div>
        </div>
    );
}

export default RadioListFilter;
