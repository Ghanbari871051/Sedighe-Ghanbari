import React, { useEffect, useLayoutEffect, useState } from 'react';

function RangeFilter({ item, handleItem, title, step, maxDifference, min, max }) {
  //  console.log(444, item);
    const [oldX, setOldX] = useState(0);
    const [directionMove, setDirectionMove] = useState('');
    const lowerVal = parseInt(item.current_min)
    const upperVal = parseInt(item.current_max)

    const [currentMin, setCurrentMin] = useState(parseInt(item.current_min))
    const [currentMax, setCurrentMax] = useState(parseInt(item.current_max))

    const handleLower = (e) => {
        if (directionMove === 'right' && currentMin + parseInt(maxDifference) < currentMax) {
            setCurrentMin(currentMin + parseInt(step))
        }
        if (directionMove === 'left') {
            setCurrentMin(currentMin - parseInt(step))
        }

    }

    const handleUpper = (e) => {

        if (directionMove === 'left' && currentMax - parseInt(maxDifference) > currentMin) {
            setCurrentMax(currentMax - parseInt(step))
        }
        if (directionMove === 'right') {
            setCurrentMax(currentMax + parseInt(step))
        }
    }




    const handleMouseMove = (e) => {
        if (e.pageX < oldX) {
            setDirectionMove('left')
        } else if (e.pageX > oldX) {
            setDirectionMove('right')
        }
        setOldX(e.pageX)
    }


    useLayoutEffect(() => {
        setCurrentMin(parseInt(item.current_min))
        setCurrentMax(parseInt(item.current_max))
    }, [item])

    useEffect(() => {
      //  console.log(currentMax);
        // console.log(item.maxPrice, currentMax !== NaN, isNaN(currentMax), currentMax, currentMin);
    }, [currentMax, currentMin, lowerVal, upperVal]); // Empty dependency array ensures it runs after the component is mounted.

    return (
        <>
            <div className="price">
                <div className="wrapper">
                    <fieldset className="filter-price">
                        <div className="price-field">
                            <input onMouseUp={() => handleItem(currentMin, currentMax)} onMouseMove={(e) => handleMouseMove(e)} onChange={handleLower} type="range" min={min} max={max} value={currentMin} id="lower" />
                            <input onMouseUp={() => handleItem(currentMin, currentMax)} onMouseMove={(e) => handleMouseMove(e)} onChange={handleUpper} type="range" min={min} max={max} value={currentMax} id="upper" />
                        </div>
                        <div className="price-wrap">
                            <span className="price-title">{title}</span>
                            <div className="price-wrap-1">
                                <input id="one" />
                                <label htmlFor="one">{currentMin}$</label>
                            </div>
                            <div className="price-wrap_line">-</div>
                            <div className="price-wrap-2">
                                <input id="two" />
                                <label htmlFor="two">{currentMax}$</label>
                            </div>
                        </div>
                    </fieldset>
                </div>
            </div>
        </>
    );
}

export default RangeFilter;