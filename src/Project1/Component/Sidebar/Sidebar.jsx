import './SidebarStyle.scss'
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import CRUD from '../../Services/CRUD'
import { useGlobalVariableContext } from '../../Context/GlobalVariableContext'

function Sidebar(props) {


    const { globalVariables, updateGlobalVariables } = useGlobalVariableContext();
    const [sidebar, setsideBar] = useState([])
    const [selectedSidebar, setSelectedSidebar] = useState()
    const [loading, setLoading] = useState(false)
    // const mainGroupID = globalVariables.mainGroup && globalVariables.mainGroup[0]
    //console.log(112, globalVariables.mainGroup);
    let IDs = globalVariables.mainGroup

    const fetchData = async () => {
        Promise.all([
            globalVariables.GetData_Mode === 'sql' ?
                await CRUD.SQL_ExecuteQuery(`select * from sidebarMenu`, globalVariables.urlBase_Server, false)
                : await CRUD.GetData(`${globalVariables.urlBase_DataBase}/sidebarMenu`),
        ]).then(([sidebarMenu]) => {

            const data = IDs && sidebarMenu && sidebarMenu?.map(item => {
                const p = IDs?.map(id => {
                    // console.log(item.mainGroupID, id.mainGroupID)
                    if (item.mainGroupID === id.mainGroupID) {
                        return item
                    }
                })
                return p.filter(n => n !== undefined)[0]
            })

            setLoading(true)
            //   console.log("data", data);
            data && setsideBar(data.filter(n => n !== undefined))
        })

    }

    useEffect(() => {
        //console.log(400, IDs, IDs.length);
        if (IDs.length === 0) {
            IDs = [{ mainGroupID: 4 }]
        }
        setLoading(false)
        fetchData()
    }, [IDs])

    useEffect(() => {
        //   console.log(6, selectedSidebar);
        updateGlobalVariables({ sidebar: selectedSidebar });
    }, [selectedSidebar])

    const HandleClickSubmenu = (id) => {
        //console.log(8);
        let x = []
        x.push({ sidebarID: id })
        setSelectedSidebar(x)
    }



    const createsubmenu = (id) => {
        //  console.log("sidebar", sidebar);
        if (sidebar && sidebar.filter(x => x.parentID === id).length === 0) {
            return <li className="has-subnav" key={id} onClick={() => HandleClickSubmenu(id)}>
                <Link to={`/${globalVariables.ProjectName}/${sidebar.filter(x => x.id === id)[0].url}`}>
                    <i className={`${sidebar.filter(x => x.id === id)[0].icon}  fa-2x`}></i>
                    <span className="nav-text">
                        {sidebar.filter(x => x.id === id)[0].name}
                    </span>
                    <i className="fa"></i>
                </Link>
            </li >
        }

        if (sidebar && sidebar.filter(x => x.parentID === id).length > 0) {
            return <li className="has-subnav" key={id}>
                <a data-bs-toggle="collapse" data-bs-target={`#demo${sidebar.filter(x => x.id === id)[0].id}`}>
                    <i className={`${sidebar.filter(x => x.id === id)[0].icon}  fa-2x`}></i>
                    <span className="nav-text">
                        {sidebar.filter(x => x.id === id)[0].name}
                    </span>
                    <i className="fa fa-caret-down myFa"></i>
                </a>
                <ul className="collapse collapse-ul" id={`demo${sidebar.filter(x => x.id === id)[0].id}`}>
                    {sidebar && sidebar.filter(x => x.parentID === id)?.map((item) => {
                        return (
                            createsubmenu(item.id)
                        )
                    }
                    )}
                </ul>
            </li>

        }
    }

    const sidebarMenu = sidebar && sidebar?.map((item) => {
        if (item && item.parentID === null) {
            return createsubmenu(item.id)
        }
    })

    return (
        <>
            <div className="sidebar-component">
                {loading === false && <div className='sidebar'><p>Loading...</p></div>}
                {loading === true && (sidebar && sidebar.length <= 0) && <div className='sidebar'><p>No Data For Show!</p></div>}
                {loading === true && (sidebar && sidebar.length > 0) &&
                    <div className='sidebar'>
                        <nav className="main-menu">
                            <ul>
                                {sidebarMenu}
                            </ul>
                        </nav>
                    </div>
                }
            </div>
        </>
    );
}


export default Sidebar;


