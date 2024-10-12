import React, { useEffect, useState } from 'react';
import './PaginationStyle.scss'

function Pagination({ handleSelectPage, currentPage, totalPages, numOfshow }) {

    // const [flag, setflag] = useState(false)
    const [my_currentPage, set_my_currentPage] = useState(currentPage)

    const clickPrevious = () => {
        set_my_currentPage(my_currentPage - 1)
        handleSelectPage(my_currentPage - 1)
    }

    const clickNext = () => {
        set_my_currentPage(my_currentPage + 1)
        handleSelectPage(my_currentPage + 1)
    }

    const clickPage = (e, index) => {
        e.preventDefault()
        set_my_currentPage(index)
        handleSelectPage(index)
    }

    useEffect(() => {
        set_my_currentPage(currentPage)
    }, [totalPages])

    let itemList = []
    const p = () => {

        if (totalPages > 1) {
            itemList.push(<li key='pageprev' className={`page-item ${my_currentPage === 1 ? 'disabled' : ''}`}>
                <a onClick={clickPrevious} className="page-link">Previous</a>
            </li>)
        }

        if (my_currentPage <= numOfshow) {
            for (let index = 1; index <= numOfshow && index <= totalPages; index++) {
                itemList.push(<li key={`page${index}`} className="page-item">
                    <a onClick={(e) => clickPage(e, index)} className={`page-link ${my_currentPage === index ? 'active' : ''}`}
                        aria-current={`${my_currentPage === index ? 'page' : ''}`}
                        href='#'>{index}</a>
                </li>)
            }
        }
        if (my_currentPage > numOfshow) {
            for (let index = my_currentPage - (Math.ceil(numOfshow / 2)) + 1; index < my_currentPage - (numOfshow / 2) + numOfshow && index <= totalPages; index++) {
                itemList.push(<li key={`page${index}`} className="page-item">
                    <a onClick={(e) => clickPage(e, index)} className={`page-link ${my_currentPage === index ? 'active' : ''}`}
                        aria-current={`${my_currentPage === index ? 'page' : ''}`}
                        href='#'>{index}</a>
                </li>)
            }
        }

        if (totalPages > 1) {
            itemList.push(<li key='pageNext' className={`page-item ${my_currentPage === totalPages ? 'disabled' : ''}`}>
                <a onClick={clickNext} className="page-link">Next</a>
            </li>)
        }
        return itemList
    }
    return (
        <div className="pagination-component">
            <div className="row paging">
                <div className="col-12 col-md-6"> <i>Showing {my_currentPage <= numOfshow ? 1 : my_currentPage - (Math.ceil(numOfshow / 2)) + 1} to {my_currentPage <= numOfshow ? numOfshow >= totalPages ? totalPages : numOfshow : my_currentPage - (numOfshow / 2) + numOfshow >= totalPages ? Math.ceil(totalPages) : my_currentPage - (Math.ceil(numOfshow / 2)) + numOfshow} of {Math.ceil(totalPages)} entries</i></div>
                <div className="col-12 col-md-6 flex-right">
                    <nav aria-label="...">
                        <ul className="pagination">
                            {
                                p()
                            }
                        </ul>

                    </nav>
                </div>
            </div>
        </div>
    );
}

export default Pagination;
