import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';


// <!-- Vendor CSS Files -->
import './JS/vendor/bootstrap/css/bootstrap.min.css'
import './JS/vendor/bootstrap-icons/bootstrap-icons.css'
import './JS/vendor/boxicons/css/boxicons.min.css'
import './JS/vendor/glightbox/css/glightbox.min.css'
import './JS/vendor/swiper/swiper-bundle.min.css'
import './JS/vendor/aos/aos.css'

import './MySiteStyle.scss'
import './JS/main.js'
import axios from 'axios';
import Alert from '../Project1/Component/Alert/Alert.jsx';
import { initReactI18next } from 'react-i18next';
import i18next from 'i18next';

import { useTranslation } from 'react-i18next';

// Import language files
import en from './Lang/en.json';
import fr from './Lang/fr.json';

// Initialize i18next
i18next
    .use(initReactI18next)
    .init({
        interpolation: { escapeValue: false }, // React already safes from xss
        lng: 'en', // Default language
        resources: {
            en: {
                translation: en
            },
            fr: {
                translation: fr
            }
        }
    });


function MySite() {

    const { t } = useTranslation();
    const { i18n } = useTranslation();


    const fullName = 'Sedighe Ghanbari'
    ///////////////////////////////////////////////
    const [index, setIndex] = useState(0);
    const typedItems = ['Web Developer', 'Full Stack Developer', 'React JS Developer', 'IT Engineer'];
    const [displayText, setDisplayText] = useState('');
    const [showCursor, setShowCursor] = useState(true); // State to toggle cursor visibility

    const [emailName, setEmailName] = useState('')
    const [emailEmail, setEmailEmail] = useState('')
    const [emailSubject, setEmailSubject] = useState('')
    const [emailMessage, setEmailMessage] = useState('')

    const [showAlert, setShowAlert] = useState(false)
    const [AlertType, setAlertType] = useState('')

    useEffect(() => {
        console.log(666);
        const typingDelay = setTimeout(() => {
            if (displayText !== typedItems[index]) {
                setDisplayText(prevText => prevText + typedItems[index][prevText.length]);
            } else {
                // After displaying the entire text, wait for 2 seconds before moving to the next text
                const nextTextDelay = setTimeout(() => {
                    setIndex(prevIndex => (prevIndex + 1) % typedItems.length);
                    setDisplayText('');
                }, 2000);
                return () => clearTimeout(nextTextDelay); // Cleanup the timeout
            }
        }, 100); // Adjust typing speed here

        // Toggle cursor visibility every 500 milliseconds (blink effect)
        const cursorInterval = setInterval(() => {
            setShowCursor(prevShowCursor => !prevShowCursor);
        }, 500);

        return () => {
            clearTimeout(typingDelay); // Cleanup the typing timeout
            clearInterval(cursorInterval); // Cleanup the cursor interval
        };
    }, [index, displayText]); // Run whenever index or displayText changes


    /////////////////////////////
    //////////////////////////////////////////

    const [Facts, setFacts] = useState([0, 0, 0, 0]); // Array to store counters
    const FactsRef = useRef([]); // Ref to store references to each counter
    const maxValues = [145, 300, 36, 100]; // Maximum values for each counter

    useEffect(() => {
        const incrementFacts = (values) => {
            let updatedFacts = [...values];
            let hasChanged = false;

            // Increment each counter within its maximum value
            updatedFacts = updatedFacts?.map((value, index) => {
                if (value < maxValues[index]) {
                    hasChanged = true;
                    return value + 1;
                }
                return value;
            });

            // Update state only if at least one counter has changed
            if (hasChanged) {
                setFacts(updatedFacts);
                setTimeout(() => incrementFacts(updatedFacts), 10); // Call incrementFacts again after a delay
            }
        };

        // Start incrementing counters
        incrementFacts(Facts);

        return () => clearTimeout(); // Cleanup any remaining timeouts
    }, []); // Run once after component mounts

    /////////////////////////////////
    const progressRef = useRef([])
    const [progress, setProgress] = useState([
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0])
    const maxprogressValues = [
        95, 90, 95, 90, 80, 80, 70,
        85, 85, 95, 95, 80, 80]
    const skillName = [
        'React JS', 'Node JS', 'Bootstrap', 'JSON', 'MQL4', 'C#', 'Git,GitHub',
        'SQL Server', 'Rest API', 'HTML', 'CSS', 'StimulSoft', 'LINQ']

    useEffect(() => {
        const incrementProgress = (values) => {
            let updatedProgress = [...values];
            let hasChanged = false;

            // Increment each counter within its maximum value
            updatedProgress = updatedProgress?.map((value, index) => {
                if (value < maxprogressValues[index]) {
                    hasChanged = true;
                    return value + 1;
                }
                return value;
            });

            // Update state only if at least one counter has changed
            if (hasChanged) {
                setProgress(updatedProgress);
                setTimeout(() => incrementProgress(updatedProgress), 10); // Call incrementFacts again after a delay
            }
        };

        // Start incrementing counters
        incrementProgress(progress);

        return () => clearTimeout(); // Cleanup any remaining timeouts
    }, []); // Run once after component mounts

    /////////////////////////////////



    const showPortfolio = () => {
        const items = [
            {
                name: 'project1',
                img: './SampleTemplate/project1/project1.png',
                url: '/appProject1',
                filter_type: 'filter-web'
            },
            {
                name: 'Data Grid Component',
                img: './SampleTemplate/components/datagrid.png',
                url: '/MainGroupTable',
                filter_type: 'filter-component'
            }, {
                name: 'Chat Component',
                img: './SampleTemplate/components/chat.png',
                url: '/Chat',
                filter_type: 'filter-component'
            }, {
                name: 'Comment Component',
                img: './SampleTemplate/components/comment.png',
                url: '/Comment',
                filter_type: 'filter-component'
            }, {
                name: 'FAQ Component',
                img: './SampleTemplate/components/faq.png',
                url: '/FAQ',
                filter_type: 'filter-component'
            }, {
                name: 'Favorite Component',
                img: './SampleTemplate/components/favorite.png',
                url: '/Favorite',
                filter_type: 'filter-component'
            }, {
                name: 'Filter Component',
                img: './SampleTemplate/components/filter.png',
                url: '/Filters',
                filter_type: 'filter-component'
            },
            //{
            //     name: 'Five Star Component',
            //     img: './SampleTemplate/components/fivestar.png',
            //     url: '/FiveStar',
            //     filter_type: 'filter-component'
            // }, 
            {
                name: 'Footer Component',
                img: './SampleTemplate/components/footer.png',
                url: '/Footer',
                filter_type: 'filter-component'
            }, {
                name: 'Header Component',
                img: './SampleTemplate/components/header.png',
                url: '/Header',
                filter_type: 'filter-component'
            }, {
                name: 'Map Component',
                img: './SampleTemplate/components/map.png',
                url: '/Map',
                filter_type: 'filter-component'
            },
            // {
            //     name: 'Modal Component',
            //     img: './SampleTemplate/components/modal.png',
            //     url: '/Modal',
            //     filter_type: 'filter-component'
            // },
            // {
            //     name: 'Nav Menu Component',
            //     img: './SampleTemplate/components/navmenu.png',
            //     url: '/NavMenu',
            //     filter_type: 'filter-component'
            // },
            //  {
            //     name: 'Notification Component',
            //     img: './SampleTemplate/components/notification.png',
            //     url: '/Notification',
            //     filter_type: 'filter-component'
            // }, 
            {
                name: 'Product Card Component',
                img: './SampleTemplate/components/productcard.png',
                url: '/ProductCard',
                filter_type: 'filter-component'
            }, {
                name: 'Rich Text Component',
                img: './SampleTemplate/components/richtext.png',
                url: '/RichText',
                filter_type: 'filter-component'
            }, {
                name: 'Shopping Card Component',
                img: './SampleTemplate/components/shoppingcard.png',
                url: '/ShoppingCard',
                filter_type: 'filter-component'
            },
            {
                name: 'Login Component',
                img: './SampleTemplate/components/login.png',
                url: '/Login',
                filter_type: 'filter-component'
            },
            {
                name: 'Calendar Component',
                img: './SampleTemplate/components/calendar.png',
                url: '/Calendar',
                filter_type: 'filter-component'
            },
            {
                name: 'Profile Component',
                img: './SampleTemplate/components/profile.png',
                url: '/Profile',
                filter_type: 'filter-component'
            },
            {
                name: 'baker',
                img: './SampleTemplate/baker/baker.png',
                url: './SampleTemplate/baker/index.html',
                filter_type: 'filter-web'
            },
            {
                name: 'cakezone',
                img: './SampleTemplate/cakezone/cakezone.png',
                url: './SampleTemplate/cakezone/index.html',
                filter_type: 'filter-web'
            },
            {
                name: 'fashiMaster',
                img: './SampleTemplate/fashiMaster/fashiMaster.jpg',
                url: './SampleTemplate/fashiMaster/index.html',
                filter_type: 'filter-web'
            },
            {
                name: 'feane',
                img: './SampleTemplate/feane/feane.png',
                url: './SampleTemplate/feane/index.html',
                filter_type: 'filter-web'
            },
            {
                name: 'furni',
                img: './SampleTemplate/furni/furni.png',
                url: './SampleTemplate/furni/index.html',
                filter_type: 'filter-web'
            },
            // {
            //     name: 'iPortfolio',
            //     img: './SampleTemplate/iPortfolio/iPortfolio.png',
            //     url: './SampleTemplate/iPortfolio/index.html',
            //     filter_type: 'filter-web'
            // },
            {
                name: 'kider',
                img: './SampleTemplate/kider/kider.png',
                url: './SampleTemplate/kider/index.html',
                filter_type: 'filter-web'
            },
            {
                name: 'malefashionMaster',
                img: './SampleTemplate/malefashionMaster/malefashionMaster.png',
                url: './SampleTemplate/malefashionMaster/index.html',
                filter_type: 'filter-web'
            },
            {
                name: 'prixima',
                img: './SampleTemplate/prixima/prixima.png',
                url: './SampleTemplate/prixima/index.html',
                filter_type: 'filter-web'
            },
            {
                name: 'Restaurantly',
                img: './SampleTemplate/Restaurantly/Restaurantly.png',
                url: './SampleTemplate/Restaurantly/index.html',
                filter_type: 'filter-web'
            }
        ]
        const result = items?.map(item => {
            return <div className={`col-lg-4 col-md-6 portfolio-item  ${item.filter_type}`}>
                <div className="portfolio-wrap glass-hover">
                    <img src={item.img} className="img-fluid img-portfolio" alt={item.name} />
                    <hr className='hr-color' />
                    <p className='portfolio-name'>{item.name}</p>

                    <div className="item_portfolio_link">
                        {/* <a href="Images/MySite/portfolio/portfolio-1.jpg" data-gallery="portfolioGallery" className="portfolio-lightbox" title="App 1"><i className="bx bx-plus"></i></a> */}
                        <a target='_blank' href={item.url} title="More Details">{t('View')} </a>
                    </div>
                </div>
            </div>
        })
        return result
    }

    ////////////////////email

    const sendEmail = async () => {
        const emailData = {
            to: 'sedighe.ghanbary@gmail.com',
            subject: emailSubject,
            text: `Name: ${emailName}\nSubject: ${emailSubject}\nMessage: ${emailMessage}`,
        };

        try {
            const response = await axios.post(
                `${window.location.origin}/api/sendemail`,
                emailData
            );

            // Reset form fields
            setEmailName('');
            setEmailEmail('');
            setEmailSubject('');
            setEmailMessage('');

            // Set alert type based on response
            setAlertType(response.status === 200 ? 'success' : 'danger');
            setShowAlert(true);
        } catch (error) {
            console.error('Error sending email:', error);
            setAlertType('danger');
            setShowAlert(true);
        }
    };

    // const sendEmail = async () => {

    //     const emailData = {
    //         to: 'sedighe.ghanbary@gmail.com',
    //         subject: 'From MySite',
    //         text: `Name : ${emailName}  \n Subject:${emailSubject} \n Message:${emailMessage}`,
    //     }
    //     const response = await axios.post(`${window.location.origin === "http://localhost:3000" ? "http://localhost:3001" : "https://sgh871051-nodejs.liara.run"}/sendemail`, emailData)


    //     setEmailName('')
    //     setEmailEmail('')
    //     setEmailSubject('')
    //     setEmailMessage('')

    //     setAlertType(response.status === 200 ? 'success' : 'danger')
    //     setShowAlert(true)
    // }


    const closeAlert = () => {
        setShowAlert(false)
    }
    //////////////////////////////////

    const [direction, setDirection] = useState('ltr');
    const [langName, setLangName] = useState('فارسی');

    const toggleDirection = () => {
        const newDirection = direction === 'ltr' ? 'rtl' : 'ltr';
        setDirection(newDirection);
        setLangName(newDirection === 'ltr' ? 'فارسی' : 'English')
        i18n.changeLanguage(newDirection === 'ltr' ? 'en' : 'fr');
    };

    const [headerValue, setHeaderValue] = useState('NoMobileSize');
    const changeHeaderValue = () => {
        setHeaderValue(headerValue === 'NoMobileSize' ? '-300px' : headerValue === '0px' ? '-300px' : '0px')
    }
    // useEffect(()=>{

    // },[headerValue])

    return (
        <div className='MySite-Project' dir={direction}>
            <button style={direction === 'ltr' ? { right: '60px' } : { left: '60px' }} className='btn-lang' onClick={toggleDirection}><i class="fa fa-language" aria-hidden="true"></i>{langName}</button>
            <i onClick={changeHeaderValue} className="bi bi-list mobile-nav-toggle d-xl-none"></i>


            {/* header */}
            <header id="header" style={headerValue === 'NoMobileSize' ? {} : direction === 'ltr' ? headerValue === '0px' ? { left: '-300px' } : { left: '0px' } : headerValue === '0px' ? { right: '-300px' } : { right: '0px' }}>
                <div className="d-flex flex-column">
                    <div className="profile">
                        <img src="Images/MySite/profile-img.jpg" alt="" className="img-fluid rounded-circle" />
                        <h1 className="text-light"><a href="index.html">{t('fullname')}</a></h1>
                        <hr />
                        <div className="social-links mt-3 text-center">
                            {/* <a href="" className="twitter"><i className="bx bxl-twitter"></i></a>
                            <a href="" className="facebook"><i className="bx bxl-facebook"></i></a>
                            <a href="" className="instagram"><i className="bx bxl-instagram"></i></a>
                            <a href="" className="google-plus"><i className="bx bxl-skype"></i></a>
                            <a href="" className="linkedin"><i className="bx bxl-linkedin"></i></a> */}
                        </div>
                    </div>
                    <nav id="navbar" className="nav-menu navbar">
                        <ul>
                            <li><a href="#hero" className="nav-link scrollto active"><i className="bx bx-home"></i> <span>{t('Home')}</span></a></li>
                            <li><a href="#about" className="nav-link scrollto"><i className="bx bx-user"></i> <span>{t('About')}</span></a></li>
                            <li><a href="#skills" className="nav-link scrollto"><i className="fa fa-cogs"></i> <span>{t('Skills')} </span></a></li>
                            <li><a href="#resume" className="nav-link scrollto"><i className="bx bx-file-blank"></i> <span>{t('Resume')} </span></a></li>
                            <li><a href="#portfolio" className="nav-link scrollto"><i className="bx bx-book-content"></i> <span>{t('Portfolio')} </span></a></li>
                            {/* <li><a href="#services" className="nav-link scrollto"><i className="bx bx-server"></i> <span>Services</span></a></li> */}
                            <li><a href="#contact" className="nav-link scrollto"><i className="bx bx-envelope"></i> <span>{t('Contact')} </span></a></li>
                        </ul>
                    </nav>
                </div>
            </header>

            {/* first */}
            <section id="hero" className="d-flex flex-column justify-content-center align-items-center">
                <div className="hero-container" data-aos="fade-in">
                    <h1>{t('fullname')}</h1>
                    <p>{t('iam')} <span className="typed" data-typed-items={`${t('Designer')}, ${t('Developer')}, ${t('Freelancer')}, ${t('Photographer')}`}>
                        {displayText}
                        {showCursor && '|'}
                    </span></p>
                </div>
            </section>

            {/* main */}
            <main id="main">

                {/* about */}
                <section id="about" className="about">
                    <div className="container">

                        <div className="section-title">
                            <h2>{t('About')}</h2>
                            <p>{t('About-des')}</p>
                            {/* <p>My Site</p>
                            <a href='/appProject1' target='_blank'>ddd</a>
                            <br />
                            <Link to="/appProject1">Go to App Project 1</Link> */}
                        </div>

                        <div className="row">
                            <div className="col-lg-4" data-aos="fade-right">
                                <img src="Images/MySite/profile-img.jpg" className="img-fluid img-about" alt="" />
                            </div>
                            <div className="col-lg-8 pt-4 pt-lg-0 content" data-aos="fade-left">
                                <br />
                                <h3>{t('Expert React Developer')}</h3>
                                <br />
                                <p className="fst-italic">

                                </p>
                                <div className="row">
                                    <div className="col-lg-6">
                                        <ul>
                                            <li><i className={`bi ${direction === 'ltr' ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i> <strong>{t('Birthday')} :</strong> <span>{t('Birthday_val')}  </span></li>
                                            <li><i className={`bi ${direction === 'ltr' ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i> <strong>{t('Website')} :</strong> <span>{t('Website_val')}</span></li>
                                            <li><i className={`bi ${direction === 'ltr' ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i> <strong>{t('Age')} :</strong> <span>{t('Age_val')}</span></li>
                                            <li><i className={`bi ${direction === 'ltr' ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i> <strong>{t('Email')} :</strong> <span>{t('Email_val')}</span></li>
                                            <li><i className={`bi ${direction === 'ltr' ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i> <strong>{t('Phone')} :</strong> <span> {t('Phone_val')}</span></li>
                                        </ul>
                                    </div>
                                    <div className="col-lg-6">
                                        <ul>
                                            <li><i className={`bi ${direction === 'ltr' ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i> <strong>{t('Degree')} :</strong> <span>{t('Degree_val')}</span></li>

                                            <li><i className={`bi ${direction === 'ltr' ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i> <strong>{t('Freelance')} :</strong> <span>{t('Freelance_val')}</span></li>
                                            <li><i className={`bi ${direction === 'ltr' ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i> <strong>{t('Marital Status')} :</strong> <span>{t('Marital Status_val')}</span></li>
                                            <li><i className={`bi ${direction === 'ltr' ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i> <strong>{t('Children')} :</strong> <span> {t('Children_val')}</span></li>
                                        </ul>
                                    </div>
                                </div>
                                <p>
                                </p>
                            </div>
                        </div>

                    </div>
                </section>

                {/* Facts */}
                {/* <section id="facts" className="facts" ref={FactsRef}>
                    <div className="container">

                        <div className="section-title">
                            <h2>Facts</h2>
                            <p>Magnam dolores commodi suscipit. Necessitatibus eius consequatur ex aliquid fuga eum quidem. Sit sint consectetur velit. Quisquam quos quisquam cupiditate. Et nemo qui impedit suscipit alias ea. Quia fugiat sit in iste officiis commodi quidem hic quas.</p>
                        </div>

                        <div className="row no-gutters">

                            <div className="col-lg-3 col-md-6 d-md-flex align-items-md-stretch" data-aos="fade-up">
                                <div className="count-box">
                                    <i className="bi bi-emoji-smile"></i>
                                    <span data-purecounter-start="0" data-purecounter-end="232" data-purecounter-duration="1" className="purecounter">{Facts[0]}</span>
                                    <p><strong>Happy Clients</strong> consequuntur quae</p>
                                </div>
                            </div>

                            <div className="col-lg-3 col-md-6 d-md-flex align-items-md-stretch" data-aos="fade-up" data-aos-delay="100">
                                <div className="count-box">
                                    <i className="bi bi-journal-richtext"></i>
                                    <span data-purecounter-start="0" data-purecounter-end="521" data-purecounter-duration="1" className="purecounter">{Facts[1]}</span>
                                    <p><strong>Projects</strong> adipisci atque cum quia aut</p>
                                </div>
                            </div>

                            <div className="col-lg-3 col-md-6 d-md-flex align-items-md-stretch" data-aos="fade-up" data-aos-delay="200">
                                <div className="count-box">
                                    <i className="bi bi-headset"></i>
                                    <span data-purecounter-start="0" data-purecounter-end="1453" data-purecounter-duration="1" className="purecounter">{Facts[2]}</span>
                                    <p><strong>Hours Of Support</strong> aut commodi quaerat</p>
                                </div>
                            </div>

                            <div className="col-lg-3 col-md-6 d-md-flex align-items-md-stretch" data-aos="fade-up" data-aos-delay="300">
                                <div className="count-box">
                                    <i className="bi bi-people"></i>
                                    <span data-purecounter-start="0" data-purecounter-end="32" data-purecounter-duration="1" className="purecounter">{Facts[3]}</span>
                                    <p><strong>Hard Workers</strong> rerum asperiores dolor</p>
                                </div>
                            </div>

                        </div>

                    </div>
                </section> */}

                {/* skills */}
                <section id="skills" className="skills section-bg">
                    <div className="container">

                        <div className="section-title">
                            <h2>{t('Skills')}</h2>
                            {/* <p>Magnam dolores commodi suscipit. Necessitatibus eius consequatur ex aliquid fuga eum quidem. Sit sint consectetur velit. Quisquam quos quisquam cupiditate. Et nemo qui impedit suscipit alias ea. Quia fugiat sit in iste officiis commodi quidem hic quas.</p> */}
                        </div>

                        <div className="row skills-content">
                            <div className="col-lg-6" data-aos="fade-up" data-aos-delay="100">
                                <div className="progress">
                                    <span className="skill">{skillName[0]} <i className="val">{`${progress[0]}%`}</i></span>
                                    <div className="progress-bar-wrap">
                                        <div style={{ width: `${progress[0]}%` }} className="progress-bar" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>
                                <div className="progress">
                                    <span className="skill">{skillName[1]} <i className="val">{`${progress[1]}%`}</i></span>
                                    <div className="progress-bar-wrap">
                                        <div style={{ width: `${progress[1]}%` }} className="progress-bar" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>
                                <div className="progress">
                                    <span className="skill">{skillName[2]} <i className="val">{`${progress[2]}%`}</i></span>
                                    <div className="progress-bar-wrap">
                                        <div style={{ width: `${progress[2]}%` }} className="progress-bar" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>
                                <div className="progress">
                                    <span className="skill">{skillName[3]} <i className="val">{`${progress[3]}%`}</i></span>
                                    <div className="progress-bar-wrap">
                                        <div style={{ width: `${progress[3]}%` }} className="progress-bar" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>
                                <div className="progress">
                                    <span className="skill">{skillName[4]} <i className="val">{`${progress[4]}%`}</i></span>
                                    <div className="progress-bar-wrap">
                                        <div style={{ width: `${progress[4]}%` }} className="progress-bar" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>
                                <div className="progress">
                                    <span className="skill">{skillName[5]} <i className="val">{`${progress[5]}%`}</i></span>
                                    <div className="progress-bar-wrap">
                                        <div style={{ width: `${progress[5]}%` }} className="progress-bar" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-6" data-aos="fade-up" data-aos-delay="100">
                                <div className="progress">
                                    <span className="skill">{skillName[6]} <i className="val">{`${progress[6]}%`}</i></span>
                                    <div className="progress-bar-wrap">
                                        <div style={{ width: `${progress[6]}%` }} className="progress-bar" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>
                                <div className="progress">
                                    <span className="skill">{skillName[7]} <i className="val">{`${progress[7]}%`}</i></span>
                                    <div className="progress-bar-wrap">
                                        <div style={{ width: `${progress[7]}%` }} className="progress-bar" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>
                                <div className="progress">
                                    <span className="skill">{skillName[8]} <i className="val">{`${progress[8]}%`}</i></span>
                                    <div className="progress-bar-wrap">
                                        <div style={{ width: `${progress[8]}%` }} className="progress-bar" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>
                                <div className="progress">
                                    <span className="skill">{skillName[9]} <i className="val">{`${progress[9]}%`}</i></span>
                                    <div className="progress-bar-wrap">
                                        <div style={{ width: `${progress[9]}%` }} className="progress-bar" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>
                                <div className="progress">
                                    <span className="skill">{skillName[10]} <i className="val">{`${progress[10]}%`}</i></span>
                                    <div className="progress-bar-wrap">
                                        <div style={{ width: `${progress[10]}%` }} className="progress-bar" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>
                                <div className="progress">
                                    <span className="skill">{skillName[11]} <i className="val">{`${progress[11]}%`}</i></span>
                                    <div className="progress-bar-wrap">
                                        <div style={{ width: `${progress[11]}%` }} className="progress-bar" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>

                            </div>

                        </div>

                    </div>
                </section>

                {/* Resume  */}
                <section id="resume" className="resume">
                    <div className="container">

                        <div className="section-title">
                            <h2>{t('Resume')}</h2>
                            <p>{t('Resume_title')}</p>
                        </div>

                        <div className="row">
                            <div className="col-lg-6" data-aos="fade-up">
                                <h3 className="resume-title">{t('fullname')}</h3>

                                {/* <div className="resume-item pb-0">
                                    <h4>Sedighe Ghanbari</h4>
                                    <p><em>Innovative and deadline-driven Graphic Designer with 3+ years of experience designing and developing user-centered digital/print marketing material from initial concept to final, polished deliverable.</em></p>
                                    <ul>
                                        <li>Portland par 127,Orlando, FL</li>
                                        <li><i className='fa fa-phone'></i>  (+98) 09361309335</li>
                                        <li><i className=' fa fa-envelope'></i>  sedighe.ghanbary@gmail.com</li>
                                    </ul>
                                </div> */}

                                <div className="resume-item pb-0">
                                    <h4>{t('Education')}</h4>
                                    <ul style={{ listStyleType: 'disc' }}>
                                        <li>{t('Education_des1')}
                                            <ul style={{ listStyleType: 'disc' }}>
                                                <li style={{ padding: '2px' }}>{t('Education_Duration1')}</li>
                                                <li style={{ padding: '2px' }}>{t('Education_GPA1')}</li>
                                                {/* <li style={{ padding: '2px' }}>Faculty of Electronic Education, Shiraz University</li> */}
                                            </ul>
                                        </li>
                                        <li>{t('Education_des2')}
                                            <ul style={{ listStyleType: 'disc' }}>
                                                <li style={{ padding: '2px' }}>{t('Education_Duration2')}</li>
                                                <li style={{ padding: '2px' }}>{t('Education_GPA2')}</li>
                                                {/* <li style={{ padding: '2px' }}>University of Sistan and Baluchestan</li> */}
                                            </ul>
                                        </li>
                                    </ul>
                                </div>

                                <div className="resume-item pb-0">
                                    <h4>{t('Work Experiences')}</h4>
                                    <ul style={{ listStyleType: 'disc' }}>
                                        <li>{t('WorkExperiences1')}</li>
                                        <li>{t('WorkExperiences2')}</li>
                                        <li>{t('WorkExperiences3')}</li>
                                        <li>{t('WorkExperiences4')}</li>
                                        <li>{t('WorkExperiences5')}</li>
                                    </ul>
                                </div>





                            </div>
                            <div className="col-lg-6" data-aos="fade-up" data-aos-delay="100">
                                <br />
                                <br />
                                <br />
                                <div className="resume-item pb-0">
                                    <h4>{t('Projects')}</h4>
                                    <ul style={{ listStyleType: 'disc' }}>
                                        <li>{t('Projects1')}</li>
                                        <li>{t('Projects2')}</li>
                                        <li>{t('Projects3')}</li>
                                        <li>{t('Projects4')}</li>
                                        <li>{t('Projects5')}</li>
                                    </ul>
                                </div>
                                <div className="resume-item pb-0">
                                    <h4>{t('Articles, Journals, and Books')} </h4>
                                    <ul style={{ listStyleType: 'disc' }}>
                                        <li>{t('Articles1')}</li>
                                        <li>{t('Articles2')}</li>
                                        <li>{t('Articles3')}</li>
                                        <li>{t('Articles4')}</li>
                                        <li>{t('Articles5')}</li>
                                        <li>{t('Articles6')}</li>
                                        <li>{t('Articles7')}</li>
                                        <li>{t('Articles8')}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

                {/* Portfolio */}
                <section id="portfolio" className="portfolio section-bg">
                    <div className="container">

                        <div className="section-title">
                            <h2>{t('Portfolio')}</h2>
                            <p>{t('Portfolio_des')}</p>
                        </div>


                        {/* <div> <a href="./SampleTemplate/Sample1/index.html" target='_blank'>Sample1</a>  </div>
                <div> <a href="./SampleTemplate/Sample2/index.html" target='_blank'>Sample2</a>  </div>
                <div> <a href="./SampleTemplate/Sample3/index.html" target='_blank'>Sample3</a>  </div>
                <div> <a href="./SampleTemplate/Sample4/index.html" target='_blank'>Sample4</a>  </div>
                <div> <a href="./SampleTemplate/Sample5/index.html" target='_blank'>Sample5</a>  </div>
                <div> <a href="./SampleTemplate/Sample6/index.html" target='_blank'>Sample6</a>  </div>
                <div> <a href="./SampleTemplate/Sample7/index.html" target='_blank'>Sample7</a>  </div>
                <div> <a href="./SampleTemplate/Sample8/index.html" target='_blank'>Sample8</a>  </div>
                <div> <a href="./SampleTemplate/Sample9/index.html" target='_blank'>Sample9</a>  </div> */}

                        <div className="row" data-aos="fade-up">
                            <div className="col-lg-12 d-flex justify-content-center">
                                <ul id="portfolio-flters">
                                    <li data-filter="*" className="filter-active">{t('All')}</li>
                                    <li data-filter=".filter-web">{t('Web')}</li>
                                    <li data-filter=".filter-component">{t('Component')}</li>
                                    {/* <li data-filter=".filter-web">app</li> */}
                                </ul>
                            </div>
                        </div>

                        <div className="row portfolio-container" data-aos="fade-up" data-aos-delay="100">
                            {showPortfolio()}
                        </div>

                    </div>
                </section>


                {/* Services */}
                {/* <section id="services" className="services">
                    <div className="container">

                        <div className="section-title">
                            <h2>OFFers</h2>
                            <p>Magnam dolores commodi suscipit. Necessitatibus eius consequatur ex aliquid fuga eum quidem. Sit sint consectetur velit. Quisquam quos quisquam cupiditate. Et nemo qui impedit suscipit alias ea. Quia fugiat sit in iste officiis commodi quidem hic quas.</p>
                        </div>

                        <div className="row">
                            <div className="col-lg-4 col-md-6 icon-box" data-aos="fade-up">
                                <div className="icon"><i className="bi bi-briefcase"></i></div>
                                <h4 className="title"><a href="">Lorem Ipsum</a></h4>
                                <p className="description">Voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident</p>
                            </div>
                            <div className="col-lg-4 col-md-6 icon-box" data-aos="fade-up" data-aos-delay="100">
                                <div className="icon"><i className="bi bi-card-checklist"></i></div>
                                <h4 className="title"><a href="">Dolor Sitema</a></h4>
                                <p className="description">Minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat tarad limino ata</p>
                            </div>
                            <div className="col-lg-4 col-md-6 icon-box" data-aos="fade-up" data-aos-delay="200">
                                <div className="icon"><i className="bi bi-bar-chart"></i></div>
                                <h4 className="title"><a href="">Sed ut perspiciatis</a></h4>
                                <p className="description">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur</p>
                            </div>
                            <div className="col-lg-4 col-md-6 icon-box" data-aos="fade-up" data-aos-delay="300">
                                <div className="icon"><i className="bi bi-binoculars"></i></div>
                                <h4 className="title"><a href="">Magni Dolores</a></h4>
                                <p className="description">Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>
                            </div>
                            <div className="col-lg-4 col-md-6 icon-box" data-aos="fade-up" data-aos-delay="400">
                                <div className="icon"><i className="bi bi-brightness-high"></i></div>
                                <h4 className="title"><a href="">Nemo Enim</a></h4>
                                <p className="description">At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque</p>
                            </div>
                            <div className="col-lg-4 col-md-6 icon-box" data-aos="fade-up" data-aos-delay="500">
                                <div className="icon"><i className="bi bi-calendar4-week"></i></div>
                                <h4 className="title"><a href="">Eiusmod Tempor</a></h4>
                                <p className="description">Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi</p>
                            </div>
                        </div>

                    </div>
                </section> */}

                {/* Testimonials  */}
                {/* <section id="testimonials" className="testimonials section-bg">
                    <div className="container">

                        <div className="section-title">
                            <h2>Testimonials</h2>
                            <p>Magnam dolores commodi suscipit. Necessitatibus eius consequatur ex aliquid fuga eum quidem. Sit sint consectetur velit. Quisquam quos quisquam cupiditate. Et nemo qui impedit suscipit alias ea. Quia fugiat sit in iste officiis commodi quidem hic quas.</p>
                        </div>

                        <div className="testimonials-slider swiper" data-aos="fade-up" data-aos-delay="100">
                            <div className="swiper-wrapper">

                                <div className="swiper-slide">
                                    <div className="testimonial-item" data-aos="fade-up">
                                        <p>
                                            <i className="bx bxs-quote-alt-left quote-icon-left"></i>
                                            Proin iaculis purus consequat sem cure digni ssim donec porttitora entum suscipit rhoncus. Accusantium quam, ultricies eget id, aliquam eget nibh et. Maecen aliquam, risus at semper.
                                            <i className="bx bxs-quote-alt-right quote-icon-right"></i>
                                        </p>
                                        <img src="Images/MySite/testimonials/testimonials-1.jpg" className="testimonial-img" alt="" />
                                        <h3>Saul Goodman</h3>
                                        <h4>Ceo &amp; Founder</h4>
                                    </div>
                                </div>
                                <div className="swiper-slide">
                                    <div className="testimonial-item" data-aos="fade-up" data-aos-delay="100">
                                        <p>
                                            <i className="bx bxs-quote-alt-left quote-icon-left"></i>
                                            Export tempor illum tamen malis malis eram quae irure esse labore quem cillum quid cillum eram malis quorum velit fore eram velit sunt aliqua noster fugiat irure amet legam anim culpa.
                                            <i className="bx bxs-quote-alt-right quote-icon-right"></i>
                                        </p>
                                        <img src="Images/MySite/testimonials/testimonials-2.jpg" className="testimonial-img" alt="" />
                                        <h3>Sara Wilsson</h3>
                                        <h4>Designer</h4>
                                    </div>
                                </div>

                                <div className="swiper-slide">
                                    <div className="testimonial-item" data-aos="fade-up" data-aos-delay="200">
                                        <p>
                                            <i className="bx bxs-quote-alt-left quote-icon-left"></i>
                                            Enim nisi quem export duis labore cillum quae magna enim sint quorum nulla quem veniam duis minim tempor labore quem eram duis noster aute amet eram fore quis sint minim.
                                            <i className="bx bxs-quote-alt-right quote-icon-right"></i>
                                        </p>
                                        <img src="Images/MySite/testimonials/testimonials-3.jpg" className="testimonial-img" alt="" />
                                        <h3>Jena Karlis</h3>
                                        <h4>Store Owner</h4>
                                    </div>
                                </div>

                                <div className="swiper-slide">
                                    <div className="testimonial-item" data-aos="fade-up" data-aos-delay="300">
                                        <p>
                                            <i className="bx bxs-quote-alt-left quote-icon-left"></i>
                                            Fugiat enim eram quae cillum dolore dolor amet nulla culpa multos export minim fugiat minim velit minim dolor enim duis veniam ipsum anim magna sunt elit fore quem dolore labore illum veniam.
                                            <i className="bx bxs-quote-alt-right quote-icon-right"></i>
                                        </p>
                                        <img src="Images/MySite/testimonials/testimonials-4.jpg" className="testimonial-img" alt="" />
                                        <h3>Matt Brandon</h3>
                                        <h4>Freelancer</h4>
                                    </div>
                                </div>

                                <div className="swiper-slide">
                                    <div className="testimonial-item" data-aos="fade-up" data-aos-delay="400">
                                        <p>
                                            <i className="bx bxs-quote-alt-left quote-icon-left"></i>
                                            Quis quorum aliqua sint quem legam fore sunt eram irure aliqua veniam tempor noster veniam enim culpa labore duis sunt culpa nulla illum cillum fugiat legam esse veniam culpa fore nisi cillum quid.
                                            <i className="bx bxs-quote-alt-right quote-icon-right"></i>
                                        </p>
                                        <img src="Images/MySite/testimonials/testimonials-5.jpg" className="testimonial-img" alt="" />
                                        <h3>John Larson</h3>
                                        <h4>Entrepreneur</h4>
                                    </div>
                                </div>
                            </div>
                            <div className="swiper-pagination"></div>
                        </div>

                    </div>
                </section>  */}


                {/*  Contact */}
                <section id="contact" className="contact">
                    <div className="container">

                        <div className="section-title">
                            <h2>{t('Contact')}</h2>
                            {/* <p>Magnam dolores commodi suscipit. Necessitatibus eius consequatur ex aliquid fuga eum quidem. Sit sint consectetur velit. Quisquam quos quisquam cupiditate. Et nemo qui impedit suscipit alias ea. Quia fugiat sit in iste officiis commodi quidem hic quas.</p> */}
                        </div>

                        <div className="row" data-aos="fade-in">

                            <div className="col-lg-5 d-flex align-items-stretch">
                                <div className="info">
                                    {/* <div className="address">
                                        <i className="bi bi-geo-alt"></i>
                                        <h4>Location:</h4>
                                        <p>A108 Adam Street, New York, NY 535022</p>
                                    </div> */}

                                    <div className="email">
                                        <i className="bi bi-envelope"></i>
                                        <h4>{t('Email')}:</h4>
                                        <p>{t('Email_val')}</p>
                                    </div>

                                    <div className="phone">
                                        <i className="bi bi-phone"></i>
                                        <h4>{t('Phone')}:</h4>
                                        <p>{t('Phone_val')}</p>
                                    </div>

                                    {/* <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d12097.433213460943!2d-74.0062269!3d40.7101282!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xb89d1fe6bc499443!2sDowntown+Conference+Center!5e0!3m2!1smk!2sbg!4v1539943755621" frameBorder="0" style={{ border: "0", width: "100%", height: "290px" }} allowFullScreen></iframe> */}
                                </div>

                            </div>

                            <div className="col-lg-7 mt-5 mt-lg-0 d-flex align-items-stretch">
                                <div className="php-email-form">

                                    {showAlert === true &&
                                        <Alert
                                            className={AlertType}
                                            msg={AlertType === 'success' ? 'Your EMaol Sending SuccessFully' : 'Your EMaol Sending Failed!'}
                                            title={`${AlertType}!`}
                                            closeAlert={closeAlert}
                                        />
                                    }

                                    <div className="row">
                                        <div className="form-group col-md-6">
                                            <label htmlFor="name">{t('Your Name')}</label>
                                            <input type="text" name="name" value={emailName} onChange={(e) => setEmailName(e.target.value)} className="form-control" id="name" required />
                                        </div>
                                        <div className="form-group col-md-6">
                                            <label htmlFor="name">{t('Your Email')}</label>
                                            <input type="email" className="form-control" value={emailEmail} onChange={(e) => setEmailEmail(e.target.value)} name="email" id="email" required />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="name">{t('Subject')}</label>
                                        <input type="text" className="form-control" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} name="subject" id="subject" required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="name">{t('Message')}</label>
                                        <textarea className="form-control" value={emailMessage} onChange={(e) => setEmailMessage(e.target.value)} name="message" rows="10" required></textarea>
                                    </div>
                                    <div className="my-3">
                                        <div className="loading">{t('Loading')}</div>
                                        <div className="error-message"></div>
                                        <div className="sent-message">{t('Loading_des')}</div>
                                    </div>
                                    <div className="text-center"><button type='submit' onClick={() => sendEmail()}>{t('Send Message')}</button></div>
                                </div>
                            </div>

                        </div>

                    </div>
                </section>

            </main>


            {/* Footer */}
            <footer id="footer">
                <div className="container">
                    {/* <div className="copyright">
                        &copy; Copyright <strong><span>iPortfolio</span></strong>
                    </div> */}

                </div>
            </footer>

            <a href="" className="back-to-top d-flex align-items-center justify-content-center"><i className="bi bi-arrow-up-short"></i></a>
        </div>

    );
};

export default MySite;
