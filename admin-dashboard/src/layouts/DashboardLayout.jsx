import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';

import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import { Outlet } from 'react-router-dom';
function DashboardLayout() {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

        {/*  Site header */}
        {/* <BaseHeader /> */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
          <ToastContainer />
            <Outlet/>
          </div>
        </main>

        {/* <Banner /> */}

      </div>
    </div>
  );
}

export default DashboardLayout;
