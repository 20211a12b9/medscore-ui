import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { DistributorHomePage } from './components/DistributorHomePage';
import { PharmacyHomepage } from './components/PharmacyHomepage';
import { AppContext } from './AppContext';
import InvoiceForm from './components/InvoiceForm';
import PharmacySearch from './components/PharmacySearch';
import SendNotice from './components/SendNotice';
import ReportDefault from './components/ReportDefault';
import UpdateDefaultReport from './components/UpdateDefaultReport';
import CreditScoreDisplay from './components/CreditScoreDisplay';
import PharmaReport from './components/PharmaReport';
import InvoiceFormRD from './components/InvoiceFormRD';
import DownloadReport from './components/DownloadReport';
import Notices from './components/Notices';
import SMSForm from './components/SMSForm';
import ReportOfPharama from './components/ReportOfPharama';
import { AdminHomeScreen } from './components/AdminHomeScreen';

// AuthNavigator component to handle unauthenticated routes
const AuthNavigator = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Home />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="AdminHomeScreen" element={<AdminHomeScreen />} />
      <Route path="/" element={<Navigate to="/AdminHomeScreen" replace />} />
      <Route path="*" element={<Navigate to="/AdminHomeScreen" replace />} />
     
    </Routes>
  );
};
// Distributor routes
const DistributorRoutes = () => {
  return (
    <Routes>
      <Route path="DistributorHomePage" element={<DistributorHomePage />} />
      <Route path="/InvoiceForm" element={<InvoiceForm />} />
      <Route path="/PharmacySearch" element={<PharmacySearch />} />
      <Route path="/SendNotice" element={<SendNotice />} />
      <Route path="/ReportDefault" element={<ReportDefault />} />
      <Route path="/UpdateDefaultReport" element={<UpdateDefaultReport />} />
      <Route path="/InvoiceFormRD" element={<InvoiceFormRD />} />
      <Route path="/SMSForm" element={<SMSForm />} />
      <Route path="/ReportOfPharama" element={<ReportOfPharama />} />
      <Route path="/" element={<Navigate to="DistributorHomePage" replace />} />
      <Route path="*" element={<Navigate to="DistributorHomePage" replace />} />
    </Routes>
  );
};

// Pharmacy routes
const PharmacyRoutes = () => {
  return (
    <Routes>
      <Route path="PharmacyHomepage" element={<PharmacyHomepage />} />
      <Route path="/CreditScoreDisplay" element={<CreditScoreDisplay/>} />
      <Route path="/PharmaReport" element={<PharmaReport/>} />
      <Route path="/DownloadReport" element={<DownloadReport/>} />
      <Route path="/Notices" element={<Notices/>} />
      <Route path="/" element={<Navigate to="PharmacyHomepage" replace />} />
      <Route path="*" element={<Navigate to="PharmacyHomepage" replace />} />
    </Routes>
  );
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    const checkTokenAndRole = () => {
      const token = localStorage.getItem("jwttoken");
      const userRole = localStorage.getItem("userType");
      console.log("role in app.js", userRole);
      
      if (token) {
        setIsLoggedIn(true);
        setRole(userRole);
      } else {
        setIsLoggedIn(false);
        setRole("");
      }
    };

    checkTokenAndRole();
  },100 [role]);

  return (
    <AppContext.Provider value={{ isLoggedIn, setIsLoggedIn, role, setRole }}>
      <Router>
        <div className="App">
          {!isLoggedIn ? (
            <AuthNavigator />
          ) : role === "Admin" ? (
            <AdminRoutes />
          ) : role === "Dist" ? (
            <DistributorRoutes />
          ) : (
            <PharmacyRoutes />
          )}
        </div>
      </Router>
    </AppContext.Provider>
  );
}

export default App;