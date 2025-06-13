import { Route, Routes } from "react-router-dom";
import Sidebar from "./components/common/Sidebar";
import Categories from "./pages/Categories";
import Courses from "./pages/CoursesCategories";
import Enrollments from "./pages/Enrollments";
import Queries from "./pages/Queries";
import Emails from "./pages/BorcEmail";
import LoginPage from "./pages/Login-Page";


import { useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
  const hideSidebar = location.pathname === "/";

  return (
    <div className='flex h-screen bg-gray-900 text-gray-100 overflow-hidden'>
      {/* BG */}
      {!hideSidebar && (
        <div className='fixed inset-0 z-0'>
          <div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80' />
          <div className='absolute inset-0 backdrop-blur-sm' />
        </div>
      )}

      {!hideSidebar && <Sidebar />}

	  const private_route = 
      
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Categories />} />
        <Route path="/Cocat" element={<Courses />} />
        <Route path="/Enroll" element={<Enrollments />} />
        <Route path="/Queries" element={<Queries />} />
        <Route path="/Emails" element={<Emails />} />
      </Routes>
    </div>
  );
}

export default App;
