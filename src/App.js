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
import { Navbar } from './components/Navbar';
import { PharmaNavbar } from './components/PharmaNavbar';
import { HomeNavbar } from './components/HomeNavbar';
import UploadDistCentalData from './components/UploadDistCentalData';
import { AdminDisputedData } from './components/AdminDisputedData';
import AdminDashboard from './components/AdminDashboard';
import { AdminDistData } from './components/AdminDistData';
import { AdminpharmacyData } from './components/AdminpharmacyData';
import DisputedDatainDistribuorScn from './components/DisputedDatainDistribuorScn';
import AdminCentralData from './components/AdminCentralData.js';
import DistributorSerchedCreditscore from './components/DistributorSerchedCreditscore.js';
import AddCustomer from './components/Addcustomer.js';

import AdminDefaulters from './components/AdminDefaulters.js';
import AdminNotices from './components/AdminNotices.js';
import AdminLinkedData from './components/AdminLinkedData.js';
import AdminDIsputedbydata from './components/AdminDIsputedbydata.js';
import AdminDispytesClaimed from './components/AdminDispytesClaimed.js';
import DistributorConnections from './components/DistributorConnections.js';
import PhramaConnections from './components/PhramaConnections.js';
import DetailedDefaultedData from './components/DetailedDefaultedData.js';
import DetailedNoticesHistory from './components/DetailedNoticesHistory.js';
import { Culture } from './components/Culture.js';
import { Life } from './components/Life.js';
import { Openings } from './components/Openings.js';
import HomeFooter from './components/HomeFooter.js';
import JobPostingForm from './components/JobPostingForm.js';
import AdminJobManagement from './components/AdminJobManagement.js';
import Chatbot from './components/Chatbot.js';
import Testimonials from './components/Testimonials.js';
import { OutstandingAnalysis } from './components/OutstandingAnalysis.js';

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
        <Route path="/PrivacyPolicy" element={<PrivacyPolicy/>} />
        <Route path="/TermsConditions" element={<TermsConditions />} />
        <Route path="/ConfirmReset" element={<ConfirmReset />} />
        <Route path="/LearnMore" element={<LearnMore />} />
        <Route path="/BlogList" element={<BlogList />} />
        <Route path="/blog/:blogId" element={<BlogDetail />} />
        <Route path="/HomeNavbar" element={<HomeNavbar />} />
        <Route path="/Culture" element={<Culture />} />
        <Route path="/Life" element={<Life />} />
        <Route path="/Openings" element={<Openings />} />
        <Route path="/HomeFooter" element={<HomeFooter />} />
        <Route path="/Chatbot" element={<Chatbot />} />
        <Route path="/Testimonials" element={<Testimonials />} />
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Navigate to="/" replace />} />
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
        <Route path="/UploadDistCentalData" element={<UploadDistCentalData />} />
        <Route path="/AdminDisputedData" element={<AdminDisputedData />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/AdminDistData" element={<AdminDistData />} />
        <Route path="/AdminpharmacyData" element={<AdminpharmacyData />} />
        <Route path="/AdminCentralData" element={<AdminCentralData />} />
        <Route path="/AdminNotices" element={<AdminNotices />} />
        <Route path="/AdminDefaulters" element={<AdminDefaulters />} />
        <Route path="/AdminLinkedData" element={<AdminLinkedData />} />
        <Route path="/AdminDIsputedbydata" element={<AdminDIsputedbydata />} />
        <Route path="/AdminDispytesClaimed" element={<AdminDispytesClaimed />} />
        <Route path="/JobPostingForm" element={<JobPostingForm />} />
        <Route path="/AdminJobManagement" element={<AdminJobManagement />} />
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
        <Route path="/Addcustomer" element={<AddCustomer />} />
        <Route path="/DistributorProfile" element={<DistributorProfile />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/ConfirmReset" element={<ConfirmReset />} />
        <Route path="/FileUpload" element={<FileUpload />} />
        <Route path="/DisputedDatainDistribuorScn" element={<DisputedDatainDistribuorScn />} />
        <Route path="/DistributorSerchedCreditscore" element={<DistributorSerchedCreditscore />} />
        <Route path="/Navbar" element={<Navbar/>} />
        <Route path="/DistributorConnections" element={<DistributorConnections/>} />
        <Route path="/DetailedDefaultedData" element={<DetailedDefaultedData/>} />
        <Route path="/DetailedNoticesHistory" element={<DetailedNoticesHistory/>} />
        <Route path="/OutstandingAnalysis" element={<OutstandingAnalysis/>} />
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
        <Route path="/PharmaNavbar" element={<PharmaNavbar />} />
        <Route path="/PhramaConnections" element={<PhramaConnections/>} />
        <Route path="*" element={<Navigate to="PharmacyHomepage" replace />} />
      </Routes>
    </Suspense>
  );
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");
  const [canNavigate, setCanNavigate] = useState(true);
  useEffect(() => {
    // Initialize Analytics
    initializeAnalytics();
  }, []);
  
  // useEffect(() => {
    
  //   const handleContextMenu = (e) => {
  //     e.preventDefault(); 
  //     alert("For security reasons, right-click functionality has been disabled.");
  //   };

   
  //   document.addEventListener("contextmenu", handleContextMenu);

    
  //   return () => {
  //     document.removeEventListener("contextmenu", handleContextMenu);
  //   };
  // }, []); 
  useEffect(() => {
    const checkTokenAndRole = () => {
      const token = localStorage.getItem("jwttoken");
      const userRole = localStorage.getItem("userType");
      
      if (token) {
        // Verify token validity here if needed
        setIsLoggedIn(true);
        setRole(userRole);
      } else {
        setIsLoggedIn(false);
        setRole("");
        // Clear any remaining auth data
        localStorage.clear();
      }
    };

    checkTokenAndRole();
  },100 [role]);  // Fixed the dependency array
  useEffect(() => {
    const preventBrowserBack = (e) => {
      // Only prevent browser's back button
      if (e.type === 'popstate') {
        window.history.pushState(null, null, window.location.pathname);
      }
    };
  
    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener('popstate', preventBrowserBack);
  
    return () => {
      window.removeEventListener('popstate', preventBrowserBack);
    };
  }, []);
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