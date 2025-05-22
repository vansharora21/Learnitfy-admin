import { Route, Routes } from "react-router-dom";
import Sidebar from "./components/common/Sidebar";
import OverviewPage from "./pages/Courses";
// import CourseDesc from "./pages/CourseDescription";
import CourseCategories from "./pages/CoursesCategories";
import Enrollments from "./pages/Enrollments";
import SalesPage from "./pages/Queries";
import Emails from "./pages/BorcEmail";


function App() {
	console.log("Hello");
	return (
		<div className='flex h-screen bg-gray-900 text-gray-100 overflow-hidden'>
			{/* BG */}
			<div className='fixed inset-0 z-0'>
				<div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80' />
				<div className='absolute inset-0 backdrop-blur-sm' />
			</div>

			<Sidebar />
			<Routes>
				<Route path='/' element={<OverviewPage />} />
				<Route path='/Cocat' element={<CourseCategories />} />
				<Route path='/Enroll' element={<Enrollments />} />
				<Route path='/Queries' element={<SalesPage />} />
				<Route path='/Emails' element={<Emails/>}/>
		        {/* <Route path='/desc' element={<CourseDesc/>}/> */}
				{/* <Route path='/orders' element={<OrdersPage />} /> */}
				{/* <Route path='/analytics' element={<AnalyticsPage />} /> */}
				{/* <Route path='/settings' element={<SettingsPage />} /> */}
			</Routes>
		</div>
	);
}

export default App;
