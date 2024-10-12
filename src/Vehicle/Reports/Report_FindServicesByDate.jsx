import React, { useState } from 'react';
import Calendar from '../../Project1/Component/Calendar/Calendar';
import { useGlobalVariableContext } from '../../Project1/Context/GlobalVariableContext'
import './ReportStyle.scss'
import Select from '../../Project1/Component/Select/Select';
import Pagination from '../../Project1/Component/Pagination/Pagination';
const ReportForm = () => {

    const { globalVariables, updateGlobalVariables } = useGlobalVariableContext();

    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [reportData, setReportData] = useState([]);

    const handleFromDateChange = (date) => {
        console.log(100, date);
        setFromDate(date);
    };

    const handleToDateChange = (date) => {
        setToDate(date);
        //   console.log(101,date);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate fetching report data based on fromDate and toDate
        console.log(5, fromDate, toDate);

        fetchReportData(selectedDriver === '--همه موارد--' ? '' : selectedDriver, fromDate === '' ? '1300/01/01' : fromDate, toDate === '' ? '1500/01/01' : toDate);
    };

    const fakeReportData = [
        {
            id: 1,
            date: '1403/01/01',
            name: 'علی احمدی',
            personID: '1234567890',
            source: 'شیراز',
            destination: 'مرودشت',
            avatar: '/avatar.jfif',
            time: '11:11',
            employer: 'محمد احمدی'
        },
        {
            id: 2,
            date: '1403/01/02',
            name: 'سرور مومنی',
            personID: '2345678901',
            source: 'مشهد',
            destination: 'چناران',
            avatar: '/avatar.jfif',
            time: '10:36',
            employer: 'محمد احمدی'
        },
        {
            id: 3,
            date: '1403/01/03',
            name: 'هادی کلاهی',
            personID: '3456789012',
            source: 'قم',
            destination: 'شیراز',
            avatar: '/avatar.jfif',
            time: '10:36',
            employer: 'محمد احمدی'
        },
        {
            id: 4,
            date: '1403/01/04',
            name: 'محمد نقوی',
            personID: '4567890123',
            source: 'تهران',
            destination: 'کاشان',
            avatar: '/avatar.jfif',
            time: '10:36',
            employer: 'محمد احمدی'
        },
        {
            id: 5,
            date: '1403/01/05',
            name: 'علی احمدی', // Same name as id: 1
            personID: '1234567890', // Same personID as id: 1
            source: 'بیرجند',
            destination: 'تهران',
            avatar: '/avatar.jfif',
            time: '10:36',
            employer: 'محمد احمدی'
        },
        {
            id: 6,
            date: '1403/01/06',
            name: 'سارا نیازی',
            personID: '5678901234',
            source: 'تربت',
            destination: 'مشهد',
            avatar: '/avatar.jfif',
            time: '10:36',
            employer: 'محمد احمدی'
        },
        {
            id: 7,
            date: '1403/01/07',
            name: 'پارسا سهیلی',
            personID: '6789012345',
            source: 'فاروج',
            destination: 'قوچان',
            avatar: '/avatar.jfif',
            time: '10:36',
            employer: 'محمد احمدی'
        },
        {
            id: 8,
            date: '1403/01/08',
            name: 'نکیسا نادری',
            personID: '7890123456',
            source: 'سبزوار',
            destination: 'نیشابور',
            avatar: '/avatar.jfif',
            time: '10:36',
            employer: 'محمد احمدی'
        },
        {
            id: 9,
            date: '1403/01/09',
            name: 'هادی کلاهی', // Same name as id: 3
            personID: '3456789012', // Same personID as id: 3
            source: 'مشهد',
            destination: 'بیرجند',
            avatar: '/avatar.jfif',
            time: '10:36',
            employer: 'محمد احمدی'
        },
        {
            id: 10,
            date: '1403/01/10',
            name: 'احمد کیا',
            personID: '8901234567',
            source: 'مشهد',
            destination: 'درگز',
            avatar: '/avatar.jfif',
            time: '10:36',
            employer: 'محمد احمدی'
        }
    ];
    const fetchReportData = (selectedDriver, fromDate, toDate) => {
        // Simulate API call with fake data





        const filteredReportData = fakeReportData?.map(report => {
            console.log(111, report.date, fromDate, toDate);
            if (report.date >= fromDate && report.date <= toDate
                && (selectedDriver === '' ? 1 === 1 : report.name === selectedDriver)
            ) {
                console.log(11, report);
                return report
            }
        });

        setReportData(filteredReportData.filter(n => n !== undefined));
    };



    const showReport = () => {
        console.log(7, reportData);
        const resultBody1 = reportData.length > 0 && reportData?.map((report) => (
            <tr key={report.id}>
                <td>{report.id}</td>
                <td>{report.driver}</td>
                <td>{report.date}</td>
                <td>{report.distance}</td>
                <td>{report.fuelConsumed}</td>
            </tr>
        ))

        const resultBody = reportData && reportData.length > 0 && reportData?.map((item, index) => {
            return <li key={index} onClick={() => handleTicketDetails(item)} className="ticket-item">
                <div className="row">
                    <div className="ticket-user col-md-2 col-sm-12">
                        <span className='ticketid'>{item.id}</span>
                        <img src={`${globalVariables.imageBasePath}/${item.avatar}`} className="user-avatar" />
                        <span className="user-name">{item.name}</span>
                    </div>

                    <div className="ticket-title col-md-2 col-sm-12">
                        {/* {item.attachFileName !== '' && <i className="fa fa-paperclip attach"></i>} */}
                        <span className="title">{item.date}</span>
                    </div>

                    <div className="ticket-time  col-md-2 col-sm-6 col-xs-12">
                        <div className="divider hidden-md hidden-sm hidden-xs"></div>
                        <span className="time">{item.time}</span>
                    </div>

                    <div className="ticket-type  col-md-2 col-sm-6 col-xs-12">
                        <span className="divider hidden-xs"></span>
                        <span className="type">{item.source}</span>
                    </div>

                    <div className="ticket-type  col-md-2 col-sm-6 col-xs-12">
                        <span className="divider hidden-xs"></span>
                        <span className="type">{item.destination}</span>
                    </div>
                    <div className="ticket-type  col-md-2 col-sm-6 col-xs-12">
                        <span className="divider hidden-xs"></span>
                        <span className="type">{item.employer}</span>
                    </div>


                    {item.status === 'close' && <div className="ticket-state bg-palegreen">
                        <i className="fa fa-check"></i>
                    </div>
                    }

                </div>
            </li>
        })

        const result = <div>
            <div className="widget-box">
                <div className="widget-header bordered-bottom bordered-themesecondary reportTitle">
                    <i className="widget-icon fa fa-tags themesecondary"></i>
                    <h5 className="widget-caption  ">گزارش  سرویس/راننده</h5>
                </div>


                {/* <!--Widget Header--> */}
                <div className="widget-body">

                    <div className="widget-main no-padding">
                        <div className="tickets-container">
                            <ul className="tickets-list">
                                <p>تعداد کل سرویس ها : {resultBody.length}</p>
                                {resultBody}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        const result1 = <div>
            <h2>داده‌های گزارش:</h2>
            <table>
                <thead>
                    <tr>
                        <th>شناسه</th>
                        <th>راننده</th>
                        <th>تاریخ</th>
                        <th>فاصله</th>
                        <th>سوخت مصرفی</th>
                    </tr>
                </thead>
                <tbody>
                    {resultBody}
                </tbody>
            </table>
        </div>

        return result
    }

    const driversList = [
        { name: '--همه موارد--' },
        { name: 'علی احمدی' },
        { name: 'سرور مومنی' }
    ]
    const [selectedDriver, setSelectedDriver] = useState(driversList[0].name)

    const handleDriverChange = (value) => {
        setSelectedDriver(value)
    }

    const handlePageNumber = (pageNumber) => {
        setcurrentPage(pageNumber)
        //  setChangeFlag(!changeFlag)
    }
    const [pagesize, setpagesize] = useState(5)
    const [currentPage, setcurrentPage] = useState(1)

    const selectOptions_Pagesize = [
        { id: 1, value: 5 },
        { id: 2, value: 10 },
        { id: 3, value: 20 },
        { id: 4, value: 50 }
    ]
    const changeSizaPage = (e) => {
        let k = selectOptions_Pagesize.find(ite => ite.id === parseInt(e.target.value))
        setpagesize(k)
        setcurrentPage(1)
        // setChangeFlag(!changeFlag)
    }

    return (
        <div dir="rtl" className='report-Component' >

            <label>
                تاریخ شروع
                <Calendar type={'fa'} dir={'rtl'} ChangeDate={handleFromDateChange} />
                {/* <input type="date" value={fromDate} onChange={handleFromDateChange} /> */}
            </label>
            <label>
                تاریخ پایان
                <Calendar type={'fa'} dir={'rtl'} ChangeDate={handleToDateChange} />
                {/* <input type="date" value={toDate} onChange={handleToDateChange} /> */}
            </label>
            <label>
                نام راننده
                <select
                    className="form-control"
                    name="select"
                    value={selectedDriver}
                    onChange={(e) => handleDriverChange(e.target.value)}
                >
                    {/* <option value="" defaultValue>--همه موارد--</option> */}
                    {driversList?.map((item, index) => (
                        <option key={index} value={item.name}>
                            {item.name}
                        </option>
                    ))}
                </select>
            </label>
            <button type="button" className="btn btn-report" onClick={handleSubmit}>تولید گزارش</button>

            <div>
                <div>
                    <Select className={'select-pagination'} handleClick={changeSizaPage} options={selectOptions_Pagesize} selectedID={pagesize.id} optionID='id' optionValue='num' />
                    <i>Items</i>
                </div>
                {showReport()}
                <Pagination handleSelectPage={handlePageNumber} pagesize={parseInt(pagesize.num)} currentPage={currentPage} totalPages={((fakeReportData.length) / parseInt(pagesize.num)) > (Math.ceil((fakeReportData.length) / parseInt(pagesize.num))) ? Math.ceil((fakeReportData.length) / parseInt(pagesize.num)) + 1 : Math.ceil((fakeReportData.length) / parseInt(pagesize.num))} numOfshow={5} />

            </div >
        </div >
    );
};

export default ReportForm;
