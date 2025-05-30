import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, ChevronUp,Trash,Pencil } from "lucide-react";

const 	QueriesTable = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [userData, setUserData] = useState([]);
	const [filteredUsers, setFilteredUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [expandedId, setExpandedId] = useState(null);

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				setLoading(true);
				const response = await fetch('https://api.example.com/queries');
				if (!response.ok) {
					throw new Error(`Error: ${response.status} - ${response.statusText}`);
				}
				const data = await response.json();
				setUserData(data);
				setFilteredUsers(data);
				setLoading(false);
			} catch (err) {
				console.error('Failed to fetch user data:', err);
				setError(err.message);
				setLoading(false);

				// Fallback to static data if API fails
				const fallbackData = [
					{ 
						id: 1, 
						name: "John Doe", 
						email: "john@example.com", 
						phone: "+1 (555) 123-4567", 
						description: "I'm interested in learning more about your cloud computing courses. Do you offer any certifications for AWS or Azure?"
					},
					{ 
						id: 2, 
						name: "Jane Smith", 
						email: "jane@example.com", 
						phone: "+1 (555) 987-6543", 
						description: "I need information about payment plans for the Sitecore certification course. Are there any discounts for group enrollments?"
					},
					{ 
						id: 3, 
						name: "Bob Johnson", 
						email: "bob@example.com", 
						phone: "+1 (555) 456-7890", 
						description: "Can you provide more details about the course duration and schedule for the JavaScript training? I'm working full-time and need flexible options."
					},
					{ 
						id: 4, 
						name: "Alice Brown", 
						email: "alice@example.com", 
						phone: "+1 (555) 234-5678", 
						description: "I'm looking for advanced Sitecore development courses. I already have basic certification and want to specialize further."
					},
					{ 
						id: 5, 
						name: "Charlie Wilson", 
						email: "charlie@example.com", 
						phone: "+1 (555) 876-5432", 
						description: "Do you offer any job placement assistance after completing the certification? I'm interested in career transition opportunities."
					},
				];
				setUserData(fallbackData);
				setFilteredUsers(fallbackData);
			}
		};

		fetchUserData();
	}, []);

	const handleSearch = (e) => {
		const term = e.target.value.toLowerCase();
		setSearchTerm(term);

		if (term === "") {
			setFilteredUsers(userData);
			return;
		}

		const filtered = userData.filter(
			(user) => 
				user.name.toLowerCase().includes(term) || 
				user.email.toLowerCase().includes(term) ||
				user.phone.toLowerCase().includes(term) ||
				(user.description && user.description.toLowerCase().includes(term))
		);
		setFilteredUsers(filtered);
	};

	// Toggle row expansion to show description
	const toggleExpand = (id) => {
		setExpandedId(expandedId === id ? null : id);
	};

	// Handle delete functionality with API call
	const handleDelete = async (id) => {
		if (window.confirm("Are you sure you want to delete this query?")) {
			try {
				const response = await fetch(`https://api.example.com/queries/${id}`, {
					method: 'DELETE',
				});
				
				if (!response.ok) {
					throw new Error(`Error: ${response.status} - ${response.statusText}`);
				}
				
				// Update state after successful deletion
				setUserData(userData.filter(user => user.id !== id));
				setFilteredUsers(filteredUsers.filter(user => user.id !== id));
				
			} catch (err) {
				console.error('Failed to delete query:', err);
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
					<p>Loading queries...</p>
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
					<p className="mb-4">Error loading queries: {error}</p>
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
				<h2 className='text-xl font-semibold text-gray-100'>Queries</h2>
				<div className='relative'>
					<input
						type='text'
						placeholder='Search queries...'
						className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
						value={searchTerm}
						onChange={handleSearch}
					/>
					<Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
				</div>
			</div>

			{filteredUsers.length === 0 ? (
				<div className="text-center text-gray-400 py-8">
					No queries found matching your search.
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
									Details
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
									Actions
								</th>
							</tr>
						</thead>

						<tbody className='divide-y divide-gray-700'>
							{filteredUsers.map((user) => (
								<>
									<motion.tr
										key={user.id}
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ duration: 0.3 }}
										className="hover:bg-gray-700 cursor-pointer"
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
											<div className='text-sm text-gray-300'>{user.phone}</div>
										</td>
										
										<td className='px-6 py-4 whitespace-nowrap'>
											<button 
												onClick={() => toggleExpand(user.id)}
												className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
											>
												View Details
												{expandedId === user.id ? 
													<ChevronUp size={16} className="ml-1" /> : 
													<ChevronDown size={16} className="ml-1" />
												}
											</button>
										</td>

										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
										<button className='text-indigo-400 hover:text-indigo-300 mr-3'>
											<Pencil  size={18} />
										</button>
										<button className='text-red-400 hover:text-red-300'>
											<Trash size={18} />
										</button>
									</td>
									</motion.tr>
									
									<AnimatePresence>
										{expandedId === user.id && (
											<motion.tr
												initial={{ opacity: 0, height: 0 }}
												animate={{ opacity: 1, height: "auto" }}
												exit={{ opacity: 0, height: 0 }}
												transition={{ duration: 0.3 }}
												className="bg-gray-900"
											>
												<td colSpan={5} className="px-6 py-4">
													<div className="bg-gray-800 p-4 rounded-md">
														<h4 className="text-sm font-medium text-gray-300 mb-2">Query Description:</h4>
														<p className="text-sm text-gray-400 leading-relaxed">
															{user.description || "No description provided."}
														</p>
													</div>
												</td>
											</motion.tr>
										)}
									</AnimatePresence>
								</>
							))}
						</tbody>
					</table>
				</div>
			)}
		</motion.div>
	);
};

export default QueriesTable;
