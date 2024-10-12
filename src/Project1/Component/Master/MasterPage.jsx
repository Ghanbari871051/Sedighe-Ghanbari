import React, { useState } from 'react';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import Footer from '../Footer/Footer';
import Chat from '../Chat/Chat';
import Filters from '../Filters/Filters';
import './Master.scss'
import Slider from '../Slider/Slider';
import Calendar from '../Calendar/Calendar';
import Map from '../Map/Map';
import Video from '../Video/Video';
import Audio from '../Audio/Audio';
import RichText from '../RichText/RichText';
import WordWithParams from '../WordWithParams/WordWithParams';
import MyTickets from '../Ticket/MyTickets';
import UpBtn from '../UpBtn/UpBtn';

const MasterPage = ({ children }) => {

    // console.log(144, window.location.origin);
    //chat
    const [displayIconChat, setDisplayIconChat] = useState('block')
    const [collapseVisibleChat, setCollapseVisibleChat] = useState(false);

    const handleIconChat = () => {
        setDisplayIconChat('none');
        setCollapseVisibleChat(!collapseVisibleChat); // Toggle the collapse visibility
    };

    const handleIconCloseChat = () => {
        setDisplayIconChat('');
        setCollapseVisibleChat(!collapseVisibleChat); // Toggle the collapse visibility
    };


    //filter
    const [displayIconFilter, setDisplayIconFilter] = useState('block')
    const [collapseVisibleFilter, setCollapseVisibleFilter] = useState(false);

    const handleIconFilter = () => {
        setDisplayIconFilter('none');
        setCollapseVisibleFilter(!collapseVisibleFilter); // Toggle the collapse visibility
    };

    const handleIconCloseFilter = () => {
        setDisplayIconFilter('');
        setCollapseVisibleFilter(!collapseVisibleFilter); // Toggle the collapse visibility
    };


    return (
        <>
            <div className="master-component">
                <div className="row">
                    <div className="col-12">
                        <Header />
                    </div>
                </div>
                {/* <div className='row' style={{ height: '200px', width: '300px' }}>
                <Video />
            </div> */}
                {/* <div className='row' style={{ width: '50%' }}>
                <Ticket />
            </div> */}
                <div className="row">
                    <div className="col-2">
                        <Sidebar />
                    </div>
                    <div className="col-10 masterLayout">
                        <div className='masterLayout'>
                            {children}

                            {/* filter */}
                            <i data-bs-toggle="collapse" data-bs-target="#filter"
                                className='fa fa-filter filterIcon'
                                onClick={() => handleIconFilter()}
                                style={{ display: displayIconFilter }}
                            ></i>
                            <div className='filterSide'>
                                <div id="filter" className={`collapse${collapseVisibleFilter ? ' show' : ''} filterdiv`}>
                                    <i className='fa fa-remove closeIconfilter' onClick={() => handleIconCloseFilter()}></i>
                                    <Filters ShowForPortfolio={true} />
                                </div>
                            </div>

                            {/* chat */}
                            <i data-bs-toggle="collapse" data-bs-target="#chat"
                                className='fa fa-comments chatIcon'
                                onClick={() => handleIconChat()}
                                style={{ display: displayIconChat }}
                            ></i>
                            <UpBtn />
                            <div className='chatSide'>
                                <div id="chat" className={`collapse${collapseVisibleChat ? ' show' : ''} chatdiv`}>
                                    <i className='fa fa-remove closeIconChat' onClick={() => handleIconCloseChat()}></i>
                                    <Chat />

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row" style={{ marginTop: '10px' }}>
                    <Footer />
                </div>
            </div>
        </>
    );
};

export default MasterPage;