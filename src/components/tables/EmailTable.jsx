import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Pencil, Trash } from "lucide-react";

const EmailTable = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [enrollments, setEnrollments] = useState([]);
	const [filteredUsers, setFilteredUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Fetch enrollments data from API
	useEffect(() => {
		const fetchEnrollments = async () => {
			try {
				setLoading(true);
				// Replace with your actual API endpoint
				const response = await fetch('https://api.example.com/enrollments');
				
				if (!response.ok) {
					throw new Error(`Error: ${response.status} - ${response.statusText}`);
				}
				
				const data = await response.json();
				setEnrollments(data);
				setFilteredUsers(data);
				setLoading(false);
			} catch (err) {
				console.error("Failed to fetch enrollments:", err);
				setError(err.message);
				setLoading(false);
				
				// Fallback to static data if API fails
				const fallbackData = [
					{ id: 1, name: "John Doe", email: "john@example.com", phone: "+1 (555) 123-4567", Course: "Python", status: "Enrolled" },
					{ id: 2, name: "Jane Smith", email: "jane@example.com", phone: "+1 (555) 987-6543", Course: "web dev", status: "Enrolled" },
					{ id: 3, name: "Bob Johnson", email: "bob@example.com", phone: "+1 (555) 456-7890", Course: "C/C++", status: "UnEnrolled" },
					{ id: 4, name: "Alice Brown", email: "alice@example.com", phone: "+1 (555) 234-5678", Course: "java", status: "Enrolled" },
					{ id: 5, name: "Charlie Wilson", email: "charlie@example.com", phone: "+1 (555) 876-5432", Course: "Devops", status: "Enrolled" },
				];
				setEnrollments(fallbackData);
				setFilteredUsers(fallbackData);
			}
		};

		fetchEnrollments();
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
				user.name.toLowerCase().includes(term) || 
				user.email.toLowerCase().includes(term) ||
				(user.phone && user.phone.toLowerCase().includes(term)) ||
				(user.Course && user.Course.toLowerCase().includes(term))
		);
		setFilteredUsers(filtered);
	};

	// Handle deletion of enrollment
	const handleDelete = async (id) => {
		if (window.confirm("Are you sure you want to delete this enrollment?")) {
			try {
				// Replace with your actual API endpoint
				const response = await fetch(`https://api.example.com/enrollments/${id}`, {
					method: 'DELETE',
				});
				
				if (!response.ok) {
					throw new Error(`Error: ${response.status} - ${response.statusText}`);
				}
				
				// Remove from state after successful deletion
				setEnrollments(enrollments.filter(user => user.id !== id));
				setFilteredUsers(filteredUsers.filter(user => user.id !== id));
				
			} catch (err) {
				console.error("Failed to delete enrollment:", err);
				alert(`Failed to delete: ${err.message}`);
			}
		}
	};

	if (loading) {
		return (
			<motion.div
				className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 flex justify-center items-center'
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
			>
				<div className="text-white">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
					<p>Loading enrollments...</p>
				</div>
			</motion.div>
		);
	}

	if (error && filteredUsers.length === 0) {
		return (
			<motion.div
				className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
			>
				<div className="text-red-400 text-center">
					<p className="mb-4">Error loading enrollments: {error}</p>
					<button 
						onClick={() => window.location.reload()} 
						className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
					>
						Try Again
					</button>
				</div>
			</motion.div>
		);
	}

	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
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
				<div className="text-center text-gray-400 py-8">
					No enrollments found matching your search.
				</div>
			) : (
				<div className='overflow-x-auto'>
					<table className='min-w-full divide-y divide-gray-700'>
						<thead>
							<tr>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
									Name
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
									Email
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
									Phone Number
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
									Course
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
									Status
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
									Actions
								</th>
							</tr>
						</thead>

						<tbody className='divide-y divide-gray-700'>
							{filteredUsers.map((user) => (
								<motion.tr
									key={user.id}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ duration: 0.3 }}
									layout
								>
									<td className='px-6 py-4 whitespace-nowrap'>
										<div className='flex items-center'>
											<div className='flex-shrink-0 h-10 w-10'>
												<div className='h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold'>
													{user.name.charAt(0)}
												</div>
											</div>
											<div className='ml-4'>
												<div className='text-sm font-medium text-gray-100'>{user.name}</div>
											</div>
										</div>
									</td>

									<td className='px-6 py-4 whitespace-nowrap'>
										<div className='text-sm text-gray-300'>{user.email}</div>
									</td>
									
									<td className='px-6 py-4 whitespace-nowrap'>
										<div className='text-sm text-gray-300'>{user.phone || "Not provided"}</div>
									</td>
									
									<td className='px-6 py-4 whitespace-nowrap'>
										<span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-800 text-blue-100'>
											{user.Course}
										</span>
									</td>

									<td className='px-6 py-4 whitespace-nowrap'>
										<span
											className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
												user.status === "Enrolled"
													? "bg-green-800 text-green-100"
													: "bg-red-800 text-red-100"
											}`}
										>
											{user.status}
										</span>
									</td>

									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
										<button 
											className='text-indigo-400 hover:text-indigo-300 mr-3'
											onClick={() => window.location.href = `/edit-enrollment/${user.id}`}
										>
											<Pencil size={18} />
										</button>
										<button 
											className='text-red-400 hover:text-red-300'
											onClick={() => handleDelete(user.id)}
										>
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

export default EmailTable;
