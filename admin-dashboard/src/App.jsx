import React, { useEffect, Suspense, lazy } from 'react';
import {
  Routes,
  Route,
  useLocation,
  Navigate
} from 'react-router-dom';


import './charts/ChartjsConfig';

// Import pages
import DashboardLayout from './layouts/DashboardLayout';

import { CurrencyFollow, CurrencyCreate } from './pages/currencies';
import { ExchangeList, ExchangeCreate, ExchangeDetail } from './pages/exchanges';
import { Info } from './pages/info/Info';
import { Social } from './pages/social/Social';
import Index from './pages/Index';

import { Loading } from './components/ui';


function App() {

  const location = useLocation();

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto'
    window.scroll({ top: 0 })
    document.querySelector('html').style.scrollBehavior = ''
  }, [location.pathname]); // triggered on route change

  return (
    <>
      {/* <Dashboard /> */}
      <Suspense fallback={<Loading/>}>

      <Routes>
        <Route path="/panel" element={<DashboardLayout />}>

          <Route index element={<Index />} />
          <Route path="monedas"  >
            <Route index element={<CurrencyFollow />} />
            <Route path="registrar" element={<CurrencyCreate />} />
          </Route> 

          {/*
          <Route index element={<Navigate to="/admin/cambios" replace />} />
          
           <Route path="monedas"  >
            <Route index element={<CurrencyList />} />
            <Route path="registrar" element={<CurrencyCreate />} />
            <Route path=":id" element={<CurrencyDetail />} />
          </Route> 

          <Route path="cambios">
            <Route index element={<ExchangeList />} />
            <Route path="registrar" element={<ExchangeCreate />} />
            <Route path=":id" element={<ExchangeDetail />} />
          </Route>

          <Route path="info" element={<Info />} />
          <Route path="social" element={<Social />} /> 
          */}

        </Route>
      </Routes>
      </Suspense>

    </>
  );
}

export default App;
