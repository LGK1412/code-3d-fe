'use client';

import { createContext, useContext, useState } from 'react';

const AdminTabContext = createContext();

export const AdminTabProvider = ({ children }) => {
    const [activeTab, setActiveTab] = useState('products');
    return (
        <AdminTabContext.Provider value={{ activeTab, setActiveTab }}>
            {children}
        </AdminTabContext.Provider>
    );
};

export const useAdminTab = () => useContext(AdminTabContext);
