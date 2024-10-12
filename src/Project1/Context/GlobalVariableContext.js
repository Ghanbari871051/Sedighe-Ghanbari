// GlobalVariableContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';

const GlobalVariableContext = createContext();

export const GlobalVariableProvider = ({ children }) => {

    //GlobalVariables
    const [globalVariables, setGlobalVariables] = useState({

        ProjectName: "appProject1",
        GetData_Mode: "json",//sql or json
        env_mode: "view",
        urlBase_Site: window.location.origin,// "http://localhost:3000",
        urlBase_DataBase:`file://${window.location.origin}/DB_Json/db.json`,//"http://localhost:7004",
        urlBase_Server: window.location.origin,// === "http://localhost:3000" ? "http://localhost:3001" : "https://sgh871051-nodejs.liara.run",
        UploadFileBasePath_Server: window.location.origin === "http://localhost:3000" ? "http://localhost:3001/api/uploads" : "https://sgh871051-nodejs.liara.run/uploads",
        imageBasePath: `${window.location.origin}/Images/appProject1`,
        headerSearch: "",
        lang: "English",
        userInfo: {
            user: { id: 2, username: "sgh", password: "1", email: "sedigheq.ghanbary@gmail.com", name: "sedighe", avatar: "avatar.jfif", token: "sgh123", isVerified: false, phone: "0589648525", website: "www.example.com" },
            token: null
        },
        // userInfo: {
        //     user: {},
        //     token: null
        // },
        mainGroup: [],//default set in navbar // [{ mainGroupID: '12' }, { mainGroupID: '2' }, { mainGroupID: '3' }]//req.body['mainGrouID'];
        sidebar: [], //[{ sidebarID: '12' }, { sidebarID: '2' }, { sidebarID: '3' }]//req.body['sidebarID'];
        Filters: [],// {"id": "1", "filter_id": "1","value": "Red"},{"id": "2","filter_id": "1","value": "black"},
        renderShoppingCard: false,
        renderNotification: false
    });
    const updateGlobalVariables = (newGlobalVariables) => {
        setGlobalVariables((prevGlobalVariables) => ({ ...prevGlobalVariables, ...newGlobalVariables }));
    };
    const contextValue = {
        globalVariables,
        updateGlobalVariables,
    };

    useEffect(() => {
    }, [globalVariables])

    return <GlobalVariableContext.Provider value={contextValue}>{children}</GlobalVariableContext.Provider>;
};

export const useGlobalVariableContext = () => {
    return useContext(GlobalVariableContext);
};
