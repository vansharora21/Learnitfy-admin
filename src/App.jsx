import { Route, Routes } from "react-router-dom";
import Sidebar from "./components/common/Sidebar";
import Categories from "./pages/Categories";
import Courses from "./pages/CoursesCategories";
import Enrollments from "./pages/Enrollments";
import Queries from "./pages/Queries";
import Emails from "./pages/BorcEmail";
import LoginPage from "./pages/Login-Page";
import FAQPage from "./pages/FAQ";
import { useLocation } from "react-router-dom";
import CourseDetails from "./pages/CourseDetails";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from "./components/protectedRoute";

function App() {
  const location = useLocation();
  const hideSidebar = location.pathname === "/";


  const getAuth= localStorage.getItem("isAuthenticated")
  console.log(getAuth,"getAuth is here")

  return (
    <div className='flex h-screen bg-gray-900 text-gray-100 overflow-hidden'>
      {/* BG */}
      {!hideSidebar && (
        <div className='fixed inset-0 z-0'>
          <div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80' />
          <div className='absolute inset-0 backdrop-blur-sm' />
        </div>
      )}

      {!hideSidebar &&  getAuth && <Sidebar />}



      
      <Routes>
        <Route path="/" element={<LoginPage />} />


        
        <Route path="/dashboard" element={   <ProtectedRoute><Categories /> </ProtectedRoute>} />
        <Route path="/FAQ" element={<ProtectedRoute><FAQPage /></ProtectedRoute>} />
        <Route path="/Cocat" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
        <Route path="/Enroll" element={<ProtectedRoute><Enrollments /></ProtectedRoute>} />
        <Route path="/Queries" element={<ProtectedRoute><Queries /></ProtectedRoute>} />
        <Route path="/Emails" element={<ProtectedRoute><Emails /></ProtectedRoute>} />
        <Route path="/details" element={<ProtectedRoute><CourseDetails /></ProtectedRoute>} />
        {/* <Route path="/logout" element={<ProtectedRoute><Logout /></ProtectedRoute>} /> */}
      </Routes>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastStyle={{
          backgroundColor: '#1f2937',
          color: '#f9fafb',
          border: '1px solid #374151'
        }}
      />
    </div>
  );
}

export default App;
