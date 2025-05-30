import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Search, Pencil, Trash } from "lucide-react";
import { USER_CONTACT_USER } from "../../constants";

const EnrollmentsTable = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [enrollments, setEnrollments] = useState([]);
	const [filteredUsers, setFilteredUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const API = import.meta.env.VITE_BASE_URL_API

	useEffect(() => {
		const fetchresponse = async () => {
			try {
				const res = await axios.get(`${API}${USER_CONTACT_USER}`);
				const QuriesData = res.data.data.contacts;
				setEnrollments(QuriesData);
				setFilteredUsers(QuriesData);
				setLoading(false);
				console.log(setEnrollments)
			} catch (err) {
				setError(err.message || 'Failed to fetch data');
				setLoading(false);
			}
		};
		fetchresponse();
	}, []);

	const handleSearch = (e) => {
		const term = e.target.value.toLowerCase();
		setSearchTerm(term);
		if (term === "") {
			setFilteredUsers(enrollments);
			return;
		}
		const filtered = enrollments.filter(
			(user) =>
				user.name?.toLowerCase().includes(term) ||
				user.email?.toLowerCase().includes(term) ||
				user.phone?.toLowerCase().includes(term) ||
				user.Course?.toLowerCase().includes(term)
		);
		setFilteredUsers(filtered);
	};

	const handleDelete = async (id) => {
		if (window.confirm("Are you sure you want to delete this enrollment?")) {
			try {
				await fetch(`https://api.example.com/enrollments/${id}`, { method: 'DELETE' });
				setEnrollments(enrollments.filter(user => user._id !== id));
				setFilteredUsers(filteredUsers.filter(user => user._id !== id));
			} catch (err) {
				alert(`Failed to delete: ${err.message}`);
			}
		}
	};

	if (loading) {
		return (
			<motion.div className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 flex justify-center items-center' initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
				<div className="text-white text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
					<p>Loading enrollments...</p>
				</div>
			</motion.div>
		);
	}

	if (error && filteredUsers.length === 0) {
		return (
			<motion.div className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700' initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
				<div className="text-red-400 text-center">
					<p className="mb-4">Error loading enrollments: {error}</p>
					<button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
						Try Again
					</button>
				</div>
			</motion.div>
		);
	}

	return (
		<motion.div className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
			<div className='flex justify-between items-center mb-6'>
				<h2 className='text-xl font-semibold text-gray-100'>Enrollments</h2>
				<div className='relative'>
					<input
						type='text'
						placeholder='Search users...'
						className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
						value={searchTerm}
						onChange={handleSearch}
					/>
					<Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
				</div>
			</div>

			{filteredUsers.length === 0 ? (
				<div className="text-center text-gray-400 py-8">No enrollments found matching your search.</div>
			) : (
				<div className='overflow-x-auto'>
					<table className='min-w-full divide-y divide-gray-700'>
						<thead>
							<tr>
								{["Name", "Email", "Phone Number", "Course", "Status", "Actions"].map((header) => (
									<th key={header} className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
										{header}
									</th>
								))}
							</tr>
						</thead>
						<tbody className='divide-y divide-gray-700'>
							{filteredUsers.map((user) => (
								<motion.tr key={user._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="hover:bg-gray-700 cursor-pointer">
									<td className='px-6 py-4 whitespace-nowrap'>
										<div className='flex items-center'>
											<div className='h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold'>
												{user.name?.charAt(0)}
											</div>
											<div className='ml-4'>
												<div className='text-sm font-medium text-gray-100'>{user.firstName} {user.lastName}</div>
											</div>
										</div>
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{user.email}</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>+91-{user.mobile || "Not provided"}</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm'>
										<span className='bg-blue-800 text-blue-100 px-2 py-1 rounded text-xs'>{user.Course || "N/A"}</span>
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm'>
										<span className={`px-2 py-1 rounded text-xs ${user.status === "Enrolled" ? "bg-green-800 text-green-100" : "bg-red-800 text-red-100"}`}>
											{user.status === "Active" ? "Yes" : "No"}
										</span>
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
										<button className='text-indigo-400 hover:text-indigo-300 mr-3' onClick={() => window.location.href = `/edit-enrollment/${user._id}`}>
											<Pencil size={18} />
										</button>
										<button className='text-red-400 hover:text-red-300' onClick={() => handleDelete(user._id)}>
											<Trash size={18} />
										</button>
									</td>
								</motion.tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</motion.div>
	);
};

export default EnrollmentsTable;
