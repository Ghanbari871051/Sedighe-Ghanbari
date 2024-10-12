import React from 'react';

const UpBtn = () => {

    const handleScrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Optional: Smooth scrolling behavior
        });
    };

    return (
        <div onClick={handleScrollToTop} className='upBtn'>
            <i class="fa fa-arrow-up"></i>
        </div>
    );
};

export default UpBtn;