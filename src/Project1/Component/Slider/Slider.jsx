import React, { useState } from 'react';
import './SliderStyle.scss'

const Slider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const images = [
        { imgURL: 'https://www.w3schools.com/bootstrap/ny.jpg' },
        { imgURL: 'https://www.w3schools.com/bootstrap/la.jpg' },
        { imgURL: 'https://www.w3schools.com/bootstrap/chicago.jpg' },
    ];


    const nextSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide - 1 + images.length) % images.length);
    };


    const handleOl = (index) => {
        setCurrentSlide(index)
    }

    const olShow = images?.map((item, index) => {
        return <li onClick={() => handleOl(index)}
            className={currentSlide === index ? 'active' : ''}>
                <i className={currentSlide===index?'fa fa-circle':'fa fa-circle-o'}></i>
            </li>
    })

    const imgShow = () => {
        const result = images?.map((item, index) => {
            return <img src={item.imgURL} style={currentSlide === index ? { display: '' } : { display: 'none' }} className="slider-image" />
        })
        return result
    }

    return (
        <div className="slider-component">

            <i onClick={prevSlide} className='fa fa-angle-left prev'></i>

            {imgShow()}

            <i onClick={nextSlide} className='fa fa-angle-right next'></i>

            {/* OL */}
            <ol className="ol-slider">
                {olShow}
            </ol>

        </div>
    );
};



export default Slider;