import React, { useEffect, useState } from 'react';
import './ShareURLStyle.scss'
import copy from 'clipboard-copy';

const ShareURL = () => {
    const [active, setActive] = useState(false)

    const handleClick = () => {
        setActive(!active)
    }


    const handleCopy = () => {
     //   console.log(100, window.location.href);
        const currentURL = window.location.href;
        // Use clipboard-copy library to copy to clipboard
        copy(currentURL)
            .then(() => {
           //     console.log('URL copied to clipboard:', currentURL);
                // You can also provide user feedback if needed
            })
            .catch((err) => {
                console.error('Failed to copy URL to clipboard:', err);
            });
    }

    return (
        <>
            <div className="shareURL-component">
                {/* <div className={`animate slide-in-down notification-button  ${active === true ? 'active' : ''}`}>
                    <i className="fa fa-files-o"></i> Link Copied to Clipboard
                </div> */}


                <div className={`${active === true ? 'active' : ''}`}>
                    <i onClick={() => handleClick()} className={`fa fa-share-alt share-btn  ${active === true ? 'active' : ''}`}></i>
                    {/* <div className="">Share</div> */}
                    <div className={`shareUrlForm  ${active === true ? 'active' : ''}`}>
                        <div>{active === true && <>
                            <div className='txtDiv' onClick={() => handleCopy()}>
                                <i className='txt'>Copy Link</i>
                                <i className="fa fa-files-o copy"></i>
                            </div>
                            <i onClick={() => handleClick()} className='fa fa-remove copy-remove'></i>
                        </>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ShareURL;