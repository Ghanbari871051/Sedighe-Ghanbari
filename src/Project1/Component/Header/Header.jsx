import React, { useEffect, useLayoutEffect, useState } from 'react';
import "./HeaderStyle.scss";
import axios from 'axios';
import LangList from '../LangList/LangList';
import NavMenu from '../NavMenu/NavMenu';
import Search from '../Search/Search';
import ProfileHeader from '../Profile_header/ProfileHeader';
import { useGlobalVariableContext } from '../../Context/GlobalVariableContext';
import { Link } from 'react-router-dom'
import CRUD from '../../Services/CRUD';
import ShoppingCardIcon from '../ShoppingCard/ShoppingCardIcon';
import NotificationIcon from '../Notification/NotificationIcon';
import PublicFunction from '../../Services/PublicFunction'


function Header(props) {

    // Example usage
    // const numberWithCommas = PublicFunction.addCommasToNumber(1234567); // Output: "1,234,567"
    // console.log(numberWithCommas);

    //   const numberWithoutCommas = PublicFunction.removeCommasFromNumber("1,234,567"); // Output: "1234567"
    //  console.log(numberWithoutCommas);
    // const { user } = useAuthState()
    const { globalVariables, updateGlobalVariables } = useGlobalVariableContext();
    const [companyInfo, setcompanyInfo] = useState({})


    const fetchCurrentUserInfo = async (token) => {
        return axios.get(`${globalVariables.urlBase_Server}/users/me`, {
            headers: {
                authorization: token
            }
        }).then(res => res.data)
    }

    const fetchData = async () => {
        const result = globalVariables.GetData_Mode === 'sql' ?
            await CRUD.SQL_ExecuteQuery('select * from companyInfo', globalVariables.urlBase_Server, false)
            : await CRUD.GetData(`${globalVariables.urlBase_DataBase}/companyInfo`)

        return result
    }

    useLayoutEffect(() => {
        const tokenn = localStorage.getItem('token')
        if (tokenn) {
            fetchCurrentUserInfo(tokenn)
                .then(({ success, data }) => {
                    if (success) {
                        updateGlobalVariables({
                            userInfo: {
                                user: data,
                                token: tokenn
                            }
                        });
                    }
                })
        }
    }, [])

    useEffect(() => {
        fetchData().then(res => setcompanyInfo(res.data))
    }, [])

    const mainGroup = globalVariables.mainGroup && globalVariables.mainGroup?.map((item, index) => {
        return <p key={index}>{item.mainGroupID}</p>
    }
    )

    return (
        <>
            <div className="row header-component">
                <div style={{padding:'10px 0px'}} className="col-5 col-md-2 order-md-1 flex-center">
                    <a className="navbar-brand">Navbar</a>
                    {/* <Link to='/sendEmail'><i alt="Send Mail" className='fa fa-envelope headermail'></i></Link> */}
                    <NotificationIcon className={'headermail'} />
                    <ShoppingCardIcon className={'headermail'} />
                </div>
                <div className="nav-menu-header col-1 col-md-4 order-md-1 flex-left unsetPosition">
                    <div className='flex-left unsetPosition '>
                        <NavMenu type={'desktop'} />
                    </div>
                </div>
                <div className=" mobile-menu-header col-1 order-md-1  flex-center ">
                    <NavMenu type={'mobile'} />
                </div>
                <div className="col-6 order-md-3 col-md-3 flex-center ">
                    <LangList />
                    <ProfileHeader />
                </div>
                <div className="col-12 order-md-2 col-md-3  flex-right header-search">
                    <Search />
                </div>
              
            </div>



            {/* <div>
                <br />
                <br />
                <div className="alert alert-info">
                    <strong>Please Attention!
                        <br /></strong> SEE HeaderResult In Console.
                    <br />
                    <br />
                    <p> HeaderSearch:  {globalVariables.headerSearch}</p>
                    <p>  Lang:  {globalVariables.lang}</p>
                    <div>  mainGroupID: {mainGroup} </div>
                    <p>  token: {globalVariables.userInfo.token} </p>
                </div>
                {console.log("HeaderResult: ", globalVariables)}
            </div> */}

        </>
    );
}
export default Header;