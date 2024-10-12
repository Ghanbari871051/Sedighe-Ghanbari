import React, { useEffect, useState } from 'react';
import CRUD from '../../Services/CRUD';
import { useGlobalVariableContext } from '../../Context/GlobalVariableContext';

function LangList(props) {

    const { globalVariables, updateGlobalVariables } = useGlobalVariableContext();
    const [currentLangName, setCurrentLangName] = useState()
    const [langs, setLangs] = useState()



    const fetchData = async () => {
        const result = globalVariables.GetData_Mode === 'sql' ?
            await CRUD.SQL_ExecuteQuery('select * from langList', globalVariables.urlBase_Server, false)
            : await CRUD.GetData(`${globalVariables.urlBase_DataBase}/langList`)

        return result
    }

    useEffect(() => {
        fetchData().then(response => {
            setLangs(response)
        })
    }, [])

    useEffect(() => {
        fetchData().then(response => {
            setLangs(response)
            if (currentLangName !== undefined) {
                updateGlobalVariables({ lang: currentLangName });
            }
        })
    }, [currentLangName])

    const changeLang = (langname) => {
        setCurrentLangName(langname)
    }

    const langsList = langs && langs?.map((lang, id) => {
        if (lang.name !== currentLangName && lang.name !== globalVariables.lang) {
            return <li style={{cursor:"pointer"}} key={id}><a className="dropdown-item" onClick={() => changeLang(lang.name)}>{lang.name}</a></li >
        }
    });

    return (
        <>
            <div className="pad-p">
                <a style={{cursor:"pointer"}} className="d-block link-light text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                    {globalVariables.lang}
                </a>
                <ul className="dropdown-menu text-small" aria-labelledby="dropdownUser1">
                    {langsList}
                </ul>
            </div>
        </>
    );
}

export default LangList;