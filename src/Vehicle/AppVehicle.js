import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Report_FindServicesByDate from './Reports/Report_FindServicesByDate';
import { GlobalVariableProvider } from '../Project1/Context/GlobalVariableContext';

const AppVehicle = () => {
    return (
        <GlobalVariableProvider>
            <Routes>
                <Route path="/*" element={<Report_FindServicesByDate />} />
            </Routes>
        </GlobalVariableProvider>

    );
};

export default AppVehicle;