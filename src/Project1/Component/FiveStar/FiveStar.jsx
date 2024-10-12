import React, { useState } from 'react';
import './FiveStarStyle.scss'
function FiveStar({ idProduct, type, showRate }) {
    //type can be only  show send
    //showRate can be true of false

    //show of rating for a product
    const tedadNazarat = 10
    const avgRate = 3.75
    const totalStar = 5
    const floatValue = parseFloat(avgRate);
    const filledStar = Math.floor(floatValue);
    const halfStar = floatValue - filledStar;
    const emptyStar = halfStar === 0 ? totalStar - filledStar : totalStar - filledStar - 1;
    const clipPercentage = halfStar !== 0 ? halfStar * 100 : 0
    const fivestar_show = () => {
        const stars = [];
        for (let index = 1; index <= totalStar; index++) {
            stars.push(
                <>
                    <input type="radio" name="rating" value={index} />
                    {index <= filledStar && (
                        <label className='filled' htmlFor={`star${index}`}>
                            <i className='fa fa-star'></i>
                        </label>
                    )}
                    {halfStar !== 0 && index === filledStar + 1 && (
                        <label
                            style={{
                                clipPath: `polygon(0 0, ${clipPercentage}% 0, ${clipPercentage}% 100%, 0 100%)`,
                                WebkitClipPath: `polygon(0 0, ${clipPercentage}% 0, ${clipPercentage}% 100%, 0 100%)`,
                            }}
                            className='half'
                            htmlFor={`star${index}`}
                        >
                            <i className='fa fa-star'></i>
                        </label>
                    )}
                    {((halfStar !== 0 && index > filledStar + 1) || (halfStar === 0 && index > filledStar)) && (
                        <label className='empty' htmlFor={`star${index}`}>
                            <i className='fa fa-star-o'></i>
                        </label>
                    )}
                </>
            );
        }
        { showRate === true && tedadNazarat === 0 && stars.push(<><i className='showRate'>No Rate</i></>) }
        { showRate === true && tedadNazarat !== 0 && stars.push(<><i className='showRate'>{avgRate} From {tedadNazarat} </i></>) }
        return stars;
    }

    //////////////////////////////////

    const [isHovered, setHovered] = useState(false);
    const [indexHover, setIndexHover] = useState(0);

    const handleMouseOver = (index) => {
        setIndexHover(index)
        setHovered(true);
    };

    const handleMouseOut = () => {
        setIndexHover(0)
        setHovered(false);
    };

    const [rate, setRate] = useState(0)
    const [nazarDadeShode, setNazarDadeShode] = useState(false)


    const handleClick = () => {
        setNazarDadeShode(true)
    }
    const fivestar_send = () => {


        //   const rate = 3
        const stars = [];
        for (let index = 1; index <= totalStar; index++) {

            nazarDadeShode === false && stars.push(
                <>
                    <input type="radio" name="rating" value={index} />
                    {index <= rate && (
                        <label className='filled ' htmlFor={`star${index}`}>
                            <i className={`fa fa-star ${isHovered === true && index <= indexHover ? 'emptySend' : ''}`} id={`star${index}`}
                                onMouseOver={() => handleMouseOver(index)}
                                onMouseOut={handleMouseOut}
                                onClick={() => setRate(index)}></i>
                        </label>
                    )}
                    {index > rate && (
                        <label className='empty ' htmlFor={`star${index}`}>
                            <i className={`fa fa-star ${isHovered === true && index <= indexHover ? 'emptySend' : ''}`} id={`star${index}`}
                                onMouseOver={() => handleMouseOver(index)}
                                onMouseOut={handleMouseOut}
                                onClick={() => setRate(index)}></i>
                        </label>
                    )}

                </>
            )
            nazarDadeShode === true && stars.push(
                <>
                    <input type="radio" name="rating" value={index} />
                    {index <= rate && (
                        <label className='filled' htmlFor={`star${index}`}>
                            <i className='fa fa-star'></i>
                        </label>
                    )}
                    {index > rate && (
                        <label className='empty' htmlFor={`star${index}`}>
                            <i className='fa fa-star'></i>
                        </label>
                    )}
                </>
            )
        }

        nazarDadeShode === false && stars.push(<>
            <button type="button" onClick={handleClick} className="btnsubmit">Send</button>
        </>)
        return stars
    }

    return <>
        {type === 'show' &&
            <div className="fiveStar-component">
                {fivestar_show()}
            </div>
        }
        {type === 'send' &&
            <div className="fiveStar-component">
                {fivestar_send()}
            </div>
        }
    </>

}

export default FiveStar;