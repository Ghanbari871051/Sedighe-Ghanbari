import React from 'react';
import './SearchStyle.scss'

function Search({ handleSearchGrid }) {
    return (
        <>
            <div className='search-component'>
                <input className="form-control search me-2 " type="search" placeholder="Search" aria-label="Search" />
                <button className="btn btn-outline-success" type="submit">Search</button>
            </div>
        </>
    );
}

export default Search;