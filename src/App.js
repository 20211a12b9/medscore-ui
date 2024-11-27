import React, { useEffect, useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AppContext } from './AppContext';
import { LearnMore } from './components/LearnMore';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsConditions from './components/TermsConditions';
import DistributorProfile from './components/DistributorProfile';
import PharmaProfile from './components/PharmaProfile';
import FileUpload from './components/FileUpload';
import { initializeAnalytics ,trackPageView} from './utils/analytics';
import CreateBlog from './components/CreateBlog';
import BlogList from './components/BlogList';
import BlogDetail from './components/BlogDetail';

// Lazy load all components
const Home = lazy(() => import('./components/Home'));
const Login = lazy(() => import('./components/Login'));
const Register = lazy(() => import('./components/Register'));
const DistributorHomePage = lazy(() => import('./components/DistributorHomePage'));
const PharmacyHomepage = lazy(() => import('./components/PharmacyHomepage'));
const InvoiceForm = lazy(() => import('./components/InvoiceForm'));
const PharmacySearch = lazy(() => import('./components/PharmacySearch'));
const SendNotice = lazy(() => import('./components/SendNotice'));
const ReportDefault = lazy(() => import('./components/ReportDefault'));
const UpdateDefaultReport = lazy(() => import('./components/UpdateDefaultReport'));
const CreditScoreDisplay = lazy(() => import('./components/CreditScoreDisplay'));
const PharmaReport = lazy(() => import('./components/PharmaReport'));
const InvoiceFormRD = lazy(() => import('./components/InvoiceFormRD'));
const DownloadReport = lazy(() => import('./components/DownloadReport'));
const Notices = lazy(() => import('./components/Notices'));
const SMSForm = lazy(() => import('./components/SMSForm'));
const ReportOfPharama = lazy(() => import('./components/ReportOfPharama'));
const AdminHomeScreen = lazy(() => import('./components/AdminHomeScreen'));
const ForgotPassword = lazy(() => import('./components/ForgotPassword'));
const ConfirmReset = lazy(() => import('./components/ConfirmReset'));
const Addcustomer = lazy(() => import('./components/Addcustomer'));

// Loading component
const LoadingFallback = () => (
  <div className="loading-spinner">Loading...</div>
);

// AuthNavigator component
const AuthNavigator = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
        <Route path="/TermsConditions" element={<TermsConditions />} />
        <Route path="/ConfirmReset" element={<ConfirmReset />} />
        <Route path="/LearnMore" element={<LearnMore />} />
        <Route path="/BlogList" element={<BlogList />} />
        <Route path="/blog/:blogId" element={<BlogDetail />} />
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
};

const AdminRoutes = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="AdminHomeScreen" element={<AdminHomeScreen />} />
        <Route path="/CreateBlog" element={<CreateBlog />} />
        <Route path="/" element={<Navigate to="/AdminHomeScreen" replace />} />
        <Route path="*" element={<Navigate to="/AdminHomeScreen" replace />} />
      </Routes>
    </Suspense>
  );
};

const DistributorRoutes = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
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
        <Route path="/Addcustomer" element={<Addcustomer />} />
        <Route path="/DistributorProfile" element={<DistributorProfile />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/ConfirmReset" element={<ConfirmReset />} />
        <Route path="/FileUpload" element={<FileUpload />} />
        <Route path="/" element={<Navigate to="DistributorHomePage" replace />} />
        <Route path="*" element={<Navigate to="DistributorHomePage" replace />} />
      </Routes>
    </Suspense>
  );
};

const PharmacyRoutes = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="PharmacyHomepage" element={<PharmacyHomepage />} />
        <Route path="/CreditScoreDisplay" element={<CreditScoreDisplay />} />
        <Route path="/PharmaReport" element={<PharmaReport />} />
        <Route path="/DownloadReport" element={<DownloadReport />} />
        <Route path="/Notices" element={<Notices />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/ConfirmReset" element={<ConfirmReset />} />
        <Route path="/PharmaProfile" element={<PharmaProfile />} />
        <Route path="/" element={<Navigate to="PharmacyHomepage" replace />} />
        <Route path="*" element={<Navigate to="PharmacyHomepage" replace />} />
      </Routes>
    </Suspense>
  );
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    // Initialize Analytics
    initializeAnalytics();
  }, []);
  useEffect(() => {
    const checkTokenAndRole = () => {
      const token = localStorage.getItem("jwttoken");
      const userRole = localStorage.getItem("userType");
      
      if (token) {
        setIsLoggedIn(true);
        setRole(userRole);
      } else {
        setIsLoggedIn(false);
        setRole("");
      }
    };

    checkTokenAndRole();
  },100 [role]);  // Fixed the dependency array

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