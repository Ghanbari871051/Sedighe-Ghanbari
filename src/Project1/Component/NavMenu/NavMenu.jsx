
import React, { useEffect, useState } from 'react';
import './NavMenuStyle.scss'
import { useGlobalVariableContext } from '../../Context/GlobalVariableContext';
import CRUD from '../../Services/CRUD';

function NavMenu({ type }) {

    const { globalVariables, updateGlobalVariables } = useGlobalVariableContext();
    const [render, setRender] = useState(false);
    const [mainGroupID, setMainGroupID] = useState([]);
    const [mainGroupID1, setMainGroupID1] = useState([]);

    const [nav, setnav] = useState([])


    const fetchData = async (API_Address) => {
        let data = globalVariables.GetData_Mode === 'sql' ?
            await CRUD.SQL_ExecuteQuery('select * from mainGroup', globalVariables.urlBase_Server, false)
            : await CRUD.GetData(`${globalVariables.urlBase_DataBase}/mainGroup`)

        return data
    }

    const handleClick = (id) => {
        // console.log(444, getSubMenu(id));
        setMainGroupID(getSubMenu(id))
        setRender(!render)
    }

    useEffect(() => {
        //   console.log(6666,mainGroupID1, mainGroupID1.length);
        updateGlobalVariables({ mainGroup: mainGroupID1 });
    }, [render, mainGroupID, mainGroupID1])


    useEffect(() => {
        fetchData().then(data => {
            setnav(data)
        })
    }, [])

    const createsubmenu = (id) => {
        if (nav.filter(x => x.parentID === id).length === 0) {
            return <div key={id} className="subnav">
                <button onClick={() => handleClick(id)} className="subnavbtn">
                    {
                        globalVariables.lang === 'English'
                            ? nav.filter(x => x.id === id)[0].name
                            : globalVariables.lang === 'Italian'
                                ? nav.filter(x => x.id === id)[0].name_Italy
                                : globalVariables.lang === 'Japanese'
                                    ? nav.filter(x => x.id === id)[0].name_japan :
                                    nav.filter(x => x.id === id)[0].name
                    }
                </button>
            </div>
        }

        if (nav.filter(x => x.parentID === id).length > 0) {
            return <div key={id} className="subnav">
                <button onClick={() => handleClick(id)} className="subnavbtn">
                    {
                        globalVariables.lang === 'English'
                            ? nav.filter(x => x.id === id)[0].name
                            : globalVariables.lang === 'Italian'
                                ? nav.filter(x => x.id === id)[0].name_Italy
                                : globalVariables.lang === 'Japanese'
                                    ? nav.filter(x => x.id === id)[0].name_japan :
                                    nav.filter(x => x.id === id)[0].name
                    }
                    <i className="fa fa-caret-down"></i>
                </button>
                <div className="subnav-content">
                    {nav.filter(x => x.parentID === id)?.map((item) => {
                        return (
                            createsubmenu(item.id)
                        )
                    }
                    )}
                </div>
            </div>
        }
    }

    let x = []
    const getSubMenu = (id) => {
        let y = nav.filter(x => x.id === id)[0].id

        x.push({ mainGroupID: y })
        //console.log(x);
        //     console.log(6666,mainGroupID1);
        // console.log(8899,nav.filter(x => x.id === id)[0].name);
        if (nav.filter(x => x.parentID === id).length === 0) {
            setMainGroupID1(x)

        }
        if (nav.filter(x => x.parentID === id).length > 0) {
            {
                nav.filter(x => x.parentID === id)?.map((item) => {
                    getSubMenu(item.id)
                }
                )
            }
        }
    }

    const createsubmenuMobile = (id) => {
        if (nav.filter(x => x.parentID === id).length === 0) {
            return <li key={id}><div className='a-div'><div onClick={() => handleClick(id)} className="active txt">{nav.filter(x => x.id === id)[0].name}</div></div></li>
        }
        if (nav.filter(x => x.parentID === id).length > 0) {
            return <li key={id}>
                <div className='a-div' data-bs-toggle="collapse" data-bs-target={`#demo${nav.filter(x => x.id === id)[0].id}`}>
                    <div className='txt' onClick={() => handleClick(id)} >{nav.filter(x => x.id === id)[0].name}
                        <i className='fa fa-angle-down haschild'></i>
                    </div>
                </div>
                <ul id={`demo${nav.filter(x => x.id === id)[0].id}`} className="collapse collapse-ul">
                    {nav.filter(x => x.parentID === id)?.map((item) => {
                        return (
                            createsubmenuMobile(item.id)
                        )
                    }
                    )}
                </ul>
            </li>
        }
    }

    const navMenu = nav?.map((item) => {
        if (item.parentID === null)
            return createsubmenu(item.id)
    })


    const navMenuMobile = nav?.map((item) => {
        if (item.parentID === null) {
            return createsubmenuMobile(item.id)
        }
    })


    return (
        <>
            {nav.length <= 0 && <p>loadind...</p>}
            {nav.length > 0 && type === 'desktop' &&
                <div className="header-NavMenu-component">
                    <div className="navbar">
                        {navMenu}
                    </div>
                </div>
            }
            {nav.length > 0 && type === 'mobile' &&
                <div className="header-NavMenuMobile-component">
                    <nav role='navigation' className="menu navigation">
                        <i data-bs-toggle="collapse" href="#collapseExample" className="fa fa-bars"></i>
                        <ul className="collapse navigation-collapse UI" id="collapseExample">
                            {navMenuMobile}
                        </ul>
                    </nav>
                </div>
            }

        </>
    );
}

export default NavMenu;


