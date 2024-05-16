import React from 'react';
import { HashRouter, Routes,Route } from "react-router-dom";

import SetupPage from './components/SetupPage';
import ReportPage from './components/ReportPage';

function App() {
  return (
    <>
      <HashRouter>
          <Routes>
            <Route path='/' exact element={<SetupPage />}/>
            <Route path='/report' element={<ReportPage />}/>
          </Routes>
      </HashRouter>
    </>
  )
}

export default App

