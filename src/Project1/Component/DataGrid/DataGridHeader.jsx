import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';


function DataGridHeader({ headerFields, tableID, handleSort, handleHeaderSearch }) {

    const [flag, setFlag] = useState(true)
    const [id, setid] = useState('')
    const [allowresize, setAllowresize] = useState(false)
    const [allowresizeShow, setAllowresizeShow] = useState(false)
    const [allowMove, setAllowMove] = useState(false)
    const [allowMoveCopy, setAllowMoveCopy] = useState(false)
    const [firstx, setfirstx] = useState(0)
    const [currentx, setcurrentx] = useState(0)
    const [firstY, setfirstY] = useState(0)
    const [currentY, setcurrentY] = useState(0)


    let mousePos = { x: 0, y: 0 };
    const moveStart = (e, name) => {
        if (flag) {
            setFlag(false)
            const sameDiv = document.createElement('div');
            sameDiv.className = 'tr-theadCopy'
            sameDiv.innerText = name
            sameDiv.id = `${tableID}copyDiv`
            sameDiv.style.top = e.pageY

            document.getElementById(e.target.id) && document.getElementById(e.target.id).appendChild(sameDiv, document.getElementById(e.target.id))

            setfirstx(e.pageX)
            setcurrentx(e.x)
            setfirstY(e.pageY)
            setcurrentY(e.Y)
            setid(e.target.id)

            window.addEventListener('mousemove', moveGridCol)
            window.addEventListener('mouseup', endmoveGridCol)
            window.addEventListener('mousedown', moveGridCol)
        }
    }

    const moveGridCol = (event) => {
        setAllowMoveCopy(true)
        setAllowMove(false)
        mousePos = { x: event.x, y: event.y };
        setcurrentx(mousePos.x)
        setcurrentY(mousePos.y)
    }

    const endmoveGridCol = (event) => {
        setAllowMove(true)
        window.removeEventListener('mousemove', moveGridCol);
        window.removeEventListener('mouseup', endmoveGridCol)
        window.removeEventListener('mousedown', endmoveGridCol)
        setFlag(true)
    }

    const resizeStart = (e) => {
        if (flag) {
            if (document.getElementById(`${tableID}copyDiv`)) {
                const element = document.getElementById(`${tableID}copyDiv`)
                element.parentElement.removeChild(element);
            }
            e.preventDefault()
            setFlag(false)
            setfirstx(e.pageX)
            setcurrentx(e.x)
            setid(e.target.id)
            window.addEventListener('mousemove', resizeGridCol);
            window.addEventListener('mouseup', endResizeGridCol)
        }
    }

    const resizeGridCol = (event) => {
        event.preventDefault();
        setAllowresizeShow(true)
        setAllowresize(false)
        mousePos = { x: event.x, y: event.y };
        setcurrentx(mousePos.x)
    }

    const endResizeGridCol = (event) => {
        setAllowresize(true)
        setAllowresizeShow(false)
        window.removeEventListener('mousemove', resizeGridCol);
        window.removeEventListener('mouseup', endResizeGridCol)
        setFlag(true)
    }

    useEffect(() => {
        if (allowresize === true) {
            document.getElementById(id).parentElement.style.width = `${document.getElementById(id).parentElement.offsetWidth + (currentx - firstx)}px`
            setfirstx(0)
            setcurrentx(0)
            setAllowresize(false)
            setAllowresizeShow(false)
            document.getElementById(id).style.right = '0px'
        }
        if (allowresizeShow === true) {
            document.getElementById(id).style.right = `${firstx - currentx}px`
        }
        if (allowMove === true) {
            const width_th = document.getElementById(id) && document.getElementById(id).parentElement.offsetWidth
            //  const width_th = document.getElementById(id).offsetLeft - document.getElementById('tableGrid').offsetLeft
            const mizane_move_user = currentx - firstx
            const list = document.getElementsByClassName(`${tableID}_tr-thead`)
            let count = 0
            let startindex = -1
            let totalwidth = 0
            let is_right = false

            if (currentx - firstx > 0) {//push to right  
                is_right = true;
                for (let index = 0; index < list.length; index++) {
                    if (
                        document.getElementById(id) &&
                        document.getElementById(id).parentElement.offsetLeft < list[index].parentElement.offsetLeft
                        && document.getElementById(id).parentElement.offsetLeft + mizane_move_user > list[index].parentElement.offsetLeft - (list[index].parentElement.offsetWidth / 2)
                    ) {
                        count++
                        totalwidth += list[index].parentElement.offsetWidth
                        if (startindex === -1) {
                            startindex = index - 1
                        }
                    }
                }
            }
            if (currentx - firstx < 0) {//push to right  
                is_right = false

                for (let index = list.length - 1; index > 0; index--) {
                    if (
                        document.getElementById(id).parentElement.offsetLeft > list[index].parentElement.offsetLeft
                        && document.getElementById(id).parentElement.offsetLeft + mizane_move_user < list[index].parentElement.offsetLeft + (list[index].parentElement.offsetWidth / 2)
                    ) {
                        count++
                        totalwidth -= list[index].parentElement.offsetWidth
                        if (startindex === -1) {
                            startindex = index + 1
                        }
                    }
                }
            }
            if (count > 0) {
                const table = document.getElementById(tableID)
                const rows = table.rows
                for (let j = 0; j < rows.length; j++) {
                    if (is_right) {
                        for (let index = startindex; index < startindex + count; index++) {
                            if (rows[j].className.includes(`${tableID}JS_no-sub`) === true) {
                                rows[j].cells[index].parentNode.insertBefore(rows[j].cells[index + 1], rows[j].cells[index])
                            }
                        }
                    }
                    else {
                        // for (let index = startindex; index < startindex + count; index++) {
                        if (rows[j].className.includes(`${tableID}JS_no-sub`) === true) {
                            rows[j].cells[startindex - count].parentNode.insertBefore(rows[j].cells[startindex], rows[j].cells[startindex - count])
                        }
                        //  }
                    }

                }
            }

            setfirstx(0)
            setcurrentx(0)
            setAllowMove(false)
            setAllowMoveCopy(false)
            if (document.getElementById(`${tableID}copyDiv`)) {
                const element = document.getElementById(`${tableID}copyDiv`)
                element.parentElement.removeChild(element);
            }
        }


        if (allowMoveCopy === true) {
            if (document.getElementById(`${tableID}copyDiv`)) {
                const table_left = document.getElementById(tableID).offsetLeft
                const table_top = document.getElementById(tableID).offsetTop
                const div_copy_left = document.getElementById(`${tableID}copyDiv`).offsetLeft
                const div_copy_top = document.getElementById(`${tableID}copyDiv`).offsetTop

                document.getElementById(`${tableID}copyDiv`).style.left =
                    `${(currentx - firstx)}px`
                //      div_copy_left < table_left + 5 ? `${table_left - firstx}px` : `${(currentx - firstx)}px`
                document.getElementById(`${tableID}copyDiv`).style.top = `${(currentY - firstY) < 0 ? 0 : (currentY - firstY)}px`
            }
        }
    }, [mousePos])


    const [countForSort, setcountForSort] = useState(0)
    const headerItems = headerFields && headerFields?.map((item, index) => {

        if (item.access === true) {
            if (item.visible === true) {
                return <th key={`${tableID}${index}`}>
                    <div id={`${tableID}_trThead${index}`} className={`${tableID}_tr-thead tr-thead`} onMouseDown={(e) => moveStart(e, item.name)}  >
                        {item.name}
                        {item.name !== null &&
                            <>
                                <a href='#' onMouseDown={(e) => { setcountForSort(countForSort + 1); handleSort(e, item.key, countForSort) }} ><i className='fa fa-sort sort-i'></i></a>
                                <input className="form-control" onChange={(e) => handleHeaderSearch(e, item.key)} type="search" placeholder="Search" aria-label="Search" />
                            </>
                        }
                    </div>
                    <div id={`${tableID}gridThead${index}`} onMouseDown={(e) => resizeStart(e)} className="header-column-resize"></div>
                </th>
            }
        }
    })


    return (
        <tr className={`${tableID}JS_no-sub`} >
            {headerItems}
        </tr>
    );
}

export default DataGridHeader;

//https://htmldom.dev/drag-and-drop-table-column/